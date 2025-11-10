import { NextRequest, NextResponse } from 'next/server'
import { createWalletClient, http, publicActions, type Abi } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import { CONTRACT_CONFIG } from '@/config/contract'
import ConfideeABIJson from '@/abi/Confidee.json'
import { getSession } from '@/lib/sessionStore'
import { checkRateLimit } from '@/lib/rateLimitStore'

const ConfideeABI = (ConfideeABIJson as { abi: Abi }).abi
const RELAYER_PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`

export async function POST(request: NextRequest) {
  try {
    const { action, sessionToken, data } = await request.json()

    if (!sessionToken || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const session = getSession(sessionToken)

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    const userAddress = session.address

    if (!checkRateLimit(userAddress, action)) {
      return NextResponse.json(
        { success: false, error: `Daily ${action} limit reached` },
        { status: 429 }
      )
    }

    if (!RELAYER_PRIVATE_KEY) {
      return NextResponse.json(
        { success: false, error: 'Relayer not configured' },
        { status: 500 }
      )
    }

    const account = privateKeyToAccount(RELAYER_PRIVATE_KEY)
    const client = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(),
    }).extend(publicActions)

    let hash: `0x${string}`

    switch (action) {
      case 'like':
        hash = await client.writeContract({
          address: CONTRACT_CONFIG.address,
          abi: ConfideeABI,
          functionName: 'likeSecretMeta',
          args: [BigInt(data.secretId), userAddress as `0x${string}`],
        })
        break

      case 'unlike':
        hash = await client.writeContract({
          address: CONTRACT_CONFIG.address,
          abi: ConfideeABI,
          functionName: 'unlikeSecretMeta',
          args: [BigInt(data.secretId), userAddress as `0x${string}`],
        })
        break

      case 'comment':
        hash = await client.writeContract({
          address: CONTRACT_CONFIG.address,
          abi: ConfideeABI,
          functionName: 'createCommentMeta',
          args: [BigInt(data.secretId), data.content, userAddress as `0x${string}`],
        })
        break

      case 'post':
        hash = await client.writeContract({
          address: CONTRACT_CONFIG.address,
          abi: ConfideeABI,
          functionName: 'createSecretMeta',
          args: [data.content, userAddress as `0x${string}`],
        })
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

    const receipt = await client.waitForTransactionReceipt({ hash })

    let secretId: string | undefined
    if (action === 'post' && receipt.logs.length > 0) {
      const secretCreatedLog = receipt.logs.find(log =>
        log.topics.length >= 2 && log.address.toLowerCase() === CONTRACT_CONFIG.address.toLowerCase()
      )
      if (secretCreatedLog && secretCreatedLog.topics[1]) {
        secretId = BigInt(secretCreatedLog.topics[1]).toString()
      }
    }

    return NextResponse.json({
      success: true,
      txHash: hash,
      ...(secretId && { secretId }),
    })
  } catch (error: unknown) {
    console.error('Relayer execution error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Execution failed'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
