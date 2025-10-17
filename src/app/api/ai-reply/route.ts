import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Contract config (BRAND NEW Fresh Deploy - October 18, 2025)
const CONTRACT_ADDRESS = "0x49BaCB0B84b261Ee998CC057bA6ad25cC0Ff626F";
const CONTRACT_ABI = [
  "function addAIReply(uint256 _secretId, string memory _aiReply) external"
];

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

    // Generate AI reply using Gemini
    console.log('🤖 Generating AI reply with Gemini...');
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a supportive, empathetic AI companion for an anonymous mental health support platform.
Someone just shared: "${postContent}"

Respond with compassion, understanding, and helpful advice. Keep it concise (2-3 sentences max). Be warm and supportive.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiReply = response.text();
    console.log('✅ AI reply generated:', aiReply.substring(0, 100) + '...');

    // Send AI reply to blockchain
    console.log('⛓️ Sending AI reply to blockchain...');
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia.base.org");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

    // Add AI reply to blockchain
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
