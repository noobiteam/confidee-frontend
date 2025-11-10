/**
 * Shared rate limit store
 * Used by both relayer and rate-limits API to keep limits in sync
 */

export const RATE_LIMITS = {
  like: 50,    // Combined like/unlike
  unlike: 50,  // Same as like
  comment: 25,
  post: 10,
} as const

// Use global to persist across hot reloads in development
declare global {
  var rateLimitStore: Map<string, { count: number; resetAt: Date }> | undefined
}

// Shared in-memory store - persist across Next.js hot reloads
export const rateLimitStore =
  global.rateLimitStore ||
  (global.rateLimitStore = new Map<string, { count: number; resetAt: Date }>())

export interface RateLimitInfo {
  used: number
  limit: number
  remaining: number
  resetAt: string
}

/**
 * Check if user can perform action (and increment counter if yes)
 */
export function checkRateLimit(address: string, action: string): boolean {
  // Like and unlike share the same counter
  const actionKey = (action === 'like' || action === 'unlike') ? 'like' : action
  const key = `${address}:${actionKey}:${new Date().toISOString().split('T')[0]}`
  const now = new Date()
  const resetAt = new Date()
  resetAt.setHours(24, 0, 0, 0)

  let entry = rateLimitStore.get(key)

  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt }
    rateLimitStore.set(key, entry)
  }

  const limit = RATE_LIMITS[actionKey as keyof typeof RATE_LIMITS] || 10

  if (entry.count >= limit) {
    console.log(`❌ Rate limit reached for ${address}:${action} - ${entry.count}/${limit}`)
    return false
  }

  entry.count++
  rateLimitStore.set(key, entry) // Re-save after increment to ensure persistence
  console.log(`✅ Rate limit check passed for ${address}:${action} - ${entry.count}/${limit}`)
  return true
}

/**
 * Get rate limit info for an action (read-only, doesn't increment)
 */
export function getRateLimitInfo(address: string, action: string): RateLimitInfo {
  // Like and unlike share the same counter - always use 'like' key
  const actionKey = (action === 'like' || action === 'unlike') ? 'like' : action
  const key = `${address}:${actionKey}:${new Date().toISOString().split('T')[0]}`
  const now = new Date()
  const resetAt = new Date()
  resetAt.setHours(24, 0, 0, 0)

  const limit = rateLimitStore.get(key)

  if (!limit || limit.resetAt < now) {
    console.log(`📊 Get limit info for ${address}:${action} - No data, returning fresh limits`)
    return {
      used: 0,
      limit: RATE_LIMITS[actionKey as keyof typeof RATE_LIMITS] || 0,
      remaining: RATE_LIMITS[actionKey as keyof typeof RATE_LIMITS] || 0,
      resetAt: resetAt.toISOString(),
    }
  }

  const maxLimit = RATE_LIMITS[actionKey as keyof typeof RATE_LIMITS] || 0
  const info = {
    used: limit.count,
    limit: maxLimit,
    remaining: Math.max(0, maxLimit - limit.count),
    resetAt: limit.resetAt.toISOString(),
  }
  console.log(`📊 Get limit info for ${address}:${action} - Used: ${info.used}/${info.limit}, Remaining: ${info.remaining}`)
  return info
}
