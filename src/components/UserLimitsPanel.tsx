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

export default function UserLimitsPanel() {
  const { session } = useSession()
  const [limits, setLimits] = useState<UserLimits | null>(null)
  const [sessionTimeLeft, setSessionTimeLeft] = useState('')
  const [mounted, setMounted] = useState(false)

  // Check if we should show the panel
  const shouldShow = (() => {
    if (!mounted) return false

    // If session exists in hook, use it
    if (session?.token) return true

    // Otherwise, check localStorage for token (handles initial load before hook restores session)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('confidee_session')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          return parsed.expiresAt > Date.now() && parsed.token
        } catch {
          return false
        }
      }
    }

    return false
  })()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch rate limits
  useEffect(() => {
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
      console.log('🔄 Limit update triggered, refetching...')
      fetchLimits()
    }
    window.addEventListener('limitUpdate', handleLimitUpdate)

    return () => {
      clearInterval(interval)
      window.removeEventListener('limitUpdate', handleLimitUpdate)
    }
  }, [session])

  // Update countdown timers
  useEffect(() => {
    if (!limits && !session && !shouldShow) return

    const updateTimers = () => {
      // Session expiry countdown - check both hook session and localStorage
      const getSessionExpiry = () => {
        if (session?.expiresAt) return session.expiresAt

        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('confidee_session')
          if (stored) {
            try {
              const parsed = JSON.parse(stored)
              return parsed.expiresAt
            } catch {
              return null
            }
          }
        }
        return null
      }

      const expiresAt = getSessionExpiry()
      if (expiresAt) {
        const expiryTime = new Date(expiresAt)
        const now = new Date()
        const diff = expiryTime.getTime() - now.getTime()

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          setSessionTimeLeft(`${hours}h ${minutes}m`)
        } else {
          setSessionTimeLeft('Expired')
        }
      }
    }

    updateTimers()
    const interval = setInterval(updateTimers, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [limits, session, shouldShow])

  // Don't show if no valid session token
  if (!shouldShow) {
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

        {limits ? (
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

            {sessionTimeLeft && (
              <>
                <div className="border-t border-gray-200 my-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Session
                    </span>
                    <span className="font-semibold text-purple-700">{sessionTimeLeft}</span>
                  </div>
                </div>
              </>
            )}

            <p className="text-[11px] text-gray-400 pt-2 border-t border-gray-100">
              Resets at midnight UTC
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            <span>Loading...</span>
          </div>
        )}
      </div>
    </div>
  )
}
