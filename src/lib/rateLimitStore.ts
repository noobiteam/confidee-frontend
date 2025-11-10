export const RATE_LIMITS = {
  like: 50,
  unlike: 50,
  comment: 25,
  post: 10,
} as const

declare global {
  var rateLimitStore: Map<string, { count: number; resetAt: Date }> | undefined
}

export const rateLimitStore =
  global.rateLimitStore ||
  (global.rateLimitStore = new Map<string, { count: number; resetAt: Date }>())

export interface RateLimitInfo {
  used: number
  limit: number
  remaining: number
  resetAt: string
}

export function checkRateLimit(address: string, action: string): boolean {
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
    return false
  }

  entry.count++
  rateLimitStore.set(key, entry)
  return true
}

export function getRateLimitInfo(address: string, action: string): RateLimitInfo {
  const actionKey = (action === 'like' || action === 'unlike') ? 'like' : action
  const key = `${address}:${actionKey}:${new Date().toISOString().split('T')[0]}`
  const now = new Date()
  const resetAt = new Date()
  resetAt.setHours(24, 0, 0, 0)

  const limit = rateLimitStore.get(key)

  if (!limit || limit.resetAt < now) {
    return {
      used: 0,
      limit: RATE_LIMITS[actionKey as keyof typeof RATE_LIMITS] || 0,
      remaining: RATE_LIMITS[actionKey as keyof typeof RATE_LIMITS] || 0,
      resetAt: resetAt.toISOString(),
    }
  }

  const maxLimit = RATE_LIMITS[actionKey as keyof typeof RATE_LIMITS] || 0
  return {
    used: limit.count,
    limit: maxLimit,
    remaining: Math.max(0, maxLimit - limit.count),
    resetAt: limit.resetAt.toISOString(),
  }
}
