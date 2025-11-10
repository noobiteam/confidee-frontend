import { NextRequest, NextResponse } from 'next/server'
import { createWalletClient, http, publicActions, type Abi } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains'
import { CONTRACT_CONFIG } from '@/config/contract'
import ConfideeABIJson from '@/abi/Confidee.json'
import { getSession } from '@/lib/sessionStore'

const ConfideeABI = (ConfideeABIJson as any).abi as Abi
const RELAYER_PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`

const rateLimitStore = new Map<string, { count: number; resetAt: Date }>()

const RATE_LIMITS = {
  like: 10,
  unlike: 10,
  comment: 5,
  post: 2,
}

function checkRateLimit(address: string, action: string): boolean {
  const key = `${address}:${action}:${new Date().toISOString().split('T')[0]}`
  const now = new Date()
  const resetAt = new Date()
  resetAt.setHours(24, 0, 0, 0)

  let entry = rateLimitStore.get(key)

  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt }
    rateLimitStore.set(key, entry)
  }

  const limit = RATE_LIMITS[action as keyof typeof RATE_LIMITS] || 10

  if (entry.count >= limit) {
    return false
  }

  entry.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    const { action, sessionToken, data } = await request.json()

    if (!sessionToken || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('[RELAYER] Looking for session token:', sessionToken.substring(0, 10) + '...')

    const session = getSession(sessionToken)

    console.log('[RELAYER] Session found:', session ? 'YES' : 'NO', session ? `for ${session.address}` : '')

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

    // Use meta-transaction functions (V2) - pass real user address
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

    // Extract secretId from logs if action is 'post'
    let secretId: string | undefined
    if (action === 'post' && receipt.logs.length > 0) {
      // SecretCreated event: event SecretCreated(uint256 indexed secretId, address indexed owner, uint256 timestamp)
      // secretId is first topic (after event signature)
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
  } catch (error) {
    console.error('Relayer execution error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Execution failed'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
