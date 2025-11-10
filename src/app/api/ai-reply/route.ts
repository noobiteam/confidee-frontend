import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

const CONTRACT_ADDRESS = "0x76bB5ED109C7Da47526Aa1CD5c1D31b305FFdCeB";
const CONTRACT_ABI = [
  "function addAIReply(uint256 _secretId, string memory _aiReply) external"
];

// Retry utility with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  backoffMultiplier: number = 2
): Promise<T> {
  let lastError: Error | undefined;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const is503 = lastError.message.includes('503') || lastError.message.includes('overloaded');

      if (!is503 || i === maxRetries - 1) {
        throw lastError;
      }

      const delay = initialDelay * Math.pow(backoffMultiplier, i);
      console.log(`⏳ Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 AI Reply API called');
    const { postContent, secretId } = await request.json();
    console.log('📝 Post content:', postContent);
    console.log('🔢 Secret ID:', secretId);

    if (!postContent || !secretId) {
      console.error('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing postContent or secretId' },
        { status: 400 }
      );
    }

    console.log('🤖 Generating AI reply...');

    const systemPrompt = `You are a supportive, empathetic AI companion for an anonymous mental health support platform.

IMPORTANT: This is a one-way message - the user CANNOT reply back to you. So:
- DO NOT ask questions
- DO NOT end with "Would you like to..." or similar prompts
- Instead, provide validation, comfort, and actionable advice
- End with encouragement or affirmation

Respond with compassion, understanding, and helpful advice. Keep it concise (2-3 sentences max). Be warm, supportive, and conclusive.`;
    const userMessage = `Someone just shared: "${postContent}"`;

    // Try with Groq (Primary - Super Fast!)
    let aiReply: string;
    try {
      aiReply = await retryWithBackoff(async () => {
        console.log('🚀 Trying Groq (Llama 3.3 70B)...');
        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_tokens: 200,
        });
        return completion.choices[0]?.message?.content || '';
      }, 2, 500, 2);
      console.log('✅ AI reply generated with Groq (Llama 3.3)');
    } catch (error) {
      console.log('⚠️ Groq failed, falling back to Gemini...');
      console.log('❌ Groq error details:', error instanceof Error ? error.message : error);
      // Fallback to Gemini
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `${systemPrompt}\n\n${userMessage}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        aiReply = response.text();
        console.log('✅ AI reply generated with Gemini fallback');
      } catch (geminiError) {
        // Last resort: Gemini 1.5
        console.log('⚠️ Trying Gemini 1.5 as last resort...');
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `${systemPrompt}\n\n${userMessage}`;
        const result = await fallbackModel.generateContent(prompt);
        const response = await result.response;
        aiReply = response.text();
        console.log('✅ AI reply generated with Gemini 1.5');
      }
    }

    console.log('📝 AI reply:', aiReply.substring(0, 100) + '...');

    console.log('⛓️ Sending AI reply to blockchain...');
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia.base.org");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

    const tx = await contract.addAIReply(secretId, aiReply);
    console.log('📤 Transaction sent:', tx.hash);
    await tx.wait();
    console.log('✅ Transaction confirmed!');

    return NextResponse.json({
      success: true,
      aiReply,
      txHash: tx.hash
    });

  } catch (error) {
    console.error('❌ AI Reply error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI reply', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
