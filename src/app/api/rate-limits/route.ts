import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/sessionStore'
import { getRateLimitInfo } from '@/lib/rateLimitStore'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'No session token provided' },
        { status: 401 }
      )
    }

    const session = getSession(token)
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    const userAddress = session.address

    // Get rate limits for all actions
    const limits = {
      post: getRateLimitInfo(userAddress, 'post'),
      like: getRateLimitInfo(userAddress, 'like'),
      unlike: getRateLimitInfo(userAddress, 'unlike'),
      comment: getRateLimitInfo(userAddress, 'comment'),
    }

    return NextResponse.json({
      success: true,
      address: userAddress,
      limits,
    })
  } catch (error) {
    console.error('Rate limits error:', error)
    return NextResponse.json(
      { error: 'Failed to get rate limits' },
      { status: 500 }
    )
  }
}
