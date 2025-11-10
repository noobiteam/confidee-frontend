'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/hooks/useSession'

interface RateLimitInfo {
  used: number
  limit: number
  remaining: number
  resetAt: string
}

interface UserLimits {
  post: RateLimitInfo
  like: RateLimitInfo
  unlike: RateLimitInfo
  comment: RateLimitInfo
}

function getNextMidnightUTC(): Date {
  const resetAt = new Date()
  resetAt.setUTCHours(24, 0, 0, 0)
  return resetAt
}

export default function UserLimitsPanel() {
  const { session } = useSession()
  const [limits, setLimits] = useState<UserLimits | null>(null)
  const [resetTimeLeft, setResetTimeLeft] = useState('')
  const [resetTimeDisplay, setResetTimeDisplay] = useState('')
  const [mounted, setMounted] = useState(false)
  const [hasValidToken, setHasValidToken] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if we should show the panel
  useEffect(() => {
    if (!mounted) return

    // If session exists in hook, use it
    if (session?.token) {
      setHasValidToken(true)
      return
    }

    // Otherwise, check localStorage for token (handles initial load before hook restores session)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('confidee_session')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          const isValid = parsed.expiresAt > Date.now() && !!parsed.token
          setHasValidToken(isValid)
        } catch {
          setHasValidToken(false)
        }
      } else {
        setHasValidToken(false)
      }
    }
  }, [mounted, session])

  // Fetch rate limits
  useEffect(() => {
    if (!mounted) return

    // Get token from either session hook or localStorage
    const getToken = () => {
      if (session?.token) return session.token

      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('confidee_session')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (parsed.expiresAt > Date.now()) {
              return parsed.token
            }
          } catch {
            return null
          }
        }
      }
      return null
    }

    const token = getToken()
    if (!token) return

    const fetchLimits = async () => {
      try {
        const response = await fetch('/api/rate-limits', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setLimits(data.limits)
        }
      } catch (error) {
        console.error('Failed to fetch rate limits:', error)
      }
    }

    fetchLimits()
    // Refresh every 30 seconds
    const interval = setInterval(fetchLimits, 30000)

    // Listen for limit updates from actions
    const handleLimitUpdate = () => {
      fetchLimits()
    }
    window.addEventListener('limitUpdate', handleLimitUpdate)

    return () => {
      clearInterval(interval)
      window.removeEventListener('limitUpdate', handleLimitUpdate)
    }
  }, [session, mounted])

  // Update countdown timer for daily limit reset
  useEffect(() => {
    if (!hasValidToken && !limits) return

    const updateTimer = () => {
      const now = new Date()
      const nextMidnight = getNextMidnightUTC()
      const diff = nextMidnight.getTime() - now.getTime()

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setResetTimeLeft(`${hours}h ${minutes}m ${seconds}s`)

        // Format reset time in user's local timezone
        const resetTimeStr = nextMidnight.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
        setResetTimeDisplay(resetTimeStr)
      } else {
        setResetTimeLeft('Resetting...')
        setResetTimeDisplay('Now')
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000) // Update every second
    return () => clearInterval(interval)
  }, [limits, hasValidToken])

  // Don't show if no valid session token
  if (!hasValidToken) {
    return null
  }

  // Don't show loading state - only show when data is ready
  if (!limits) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-[220px]">
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-800">Daily Limits</h3>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Posts</span>
            <span className="font-semibold text-blue-700">{limits.post.remaining}/{limits.post.limit}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Likes/Unlikes</span>
            <span className="font-semibold text-pink-700">{limits.like.remaining}/{limits.like.limit}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Comments</span>
            <span className="font-semibold text-green-700">{limits.comment.remaining}/{limits.comment.limit}</span>
          </div>

          {resetTimeLeft && (
            <>
              <div className="border-t border-gray-200 my-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Resets in
                  </span>
                  <span className="font-semibold text-purple-700">{resetTimeLeft}</span>
                </div>
              </div>
            </>
          )}

          {resetTimeDisplay && (
            <p className="text-[11px] text-gray-400 pt-2 border-t border-gray-100">
              Resets at {resetTimeDisplay} (your time)
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
