import { NextRequest, NextResponse } from 'next/server'
import { verifyMessage } from 'viem'
import { randomBytes } from 'crypto'
import { setSession, cleanExpiredSessions } from '@/lib/sessionStore'

export async function POST(request: NextRequest) {
  try {
    const { address, signature, timestamp } = await request.json()

    if (!address || !signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const messageAge = Date.now() - timestamp
    if (messageAge > 5 * 60 * 1000) {
      return NextResponse.json(
        { success: false, error: 'Message expired' },
        { status: 400 }
      )
    }

    const message = `Sign this message to create a session for Confidee.\n\nThis will allow gasless transactions without signing each time.\n\nTimestamp: ${timestamp}\nAddress: ${address}`

    const isValid = await verifyMessage({
      address,
      message,
      signature,
    })

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      )
    }

    cleanExpiredSessions()

    const token = randomBytes(32).toString('hex')
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

    setSession(token, {
      address: address.toLowerCase(),
      expiresAt,
    })

    console.log('[SESSION CREATE] Token created:', token.substring(0, 10) + '...', 'for address:', address.toLowerCase())

    return NextResponse.json({
      success: true,
      token,
      expiresAt,
    })
  } catch (error) {
    console.error('Session creation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create session'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
