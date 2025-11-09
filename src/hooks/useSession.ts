import { useState, useEffect } from 'react'
import { useAccount, useSignMessage } from 'wagmi'

const SESSION_STORAGE_KEY = 'confidee_session'

interface SessionData {
  token: string
  expiresAt: number
  address: string
}

export function useSession() {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [session, setSession] = useState<SessionData | null>(null)
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [hasPrompted, setHasPrompted] = useState(false)

  useEffect(() => {
    if (!address) {
      setSession(null)
      setHasPrompted(false)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(SESSION_STORAGE_KEY)
      }
      return
    }

    const stored = typeof window !== 'undefined'
      ? localStorage.getItem(SESSION_STORAGE_KEY)
      : null

    if (stored) {
      try {
        const parsed: SessionData = JSON.parse(stored)

        if (parsed.address.toLowerCase() === address.toLowerCase()) {
          if (parsed.expiresAt > Date.now()) {
            setSession(parsed)
            setHasPrompted(true)
            return
          }
        }

        localStorage.removeItem(SESSION_STORAGE_KEY)
      } catch {
        localStorage.removeItem(SESSION_STORAGE_KEY)
      }
    }
  }, [address])

  const createSession = async () => {
    if (!address) throw new Error('Wallet not connected')

    setIsCreatingSession(true)

    try {
      const timestamp = Date.now()
      const message = `Sign this message to create a session for Confidee.\n\nThis will allow gasless transactions without signing each time.\n\nTimestamp: ${timestamp}\nAddress: ${address}`

      const signature = await signMessageAsync({ message })

      const response = await fetch('/api/session/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          signature,
          timestamp,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create session')
      }

      const result = await response.json()

      const sessionData: SessionData = {
        token: result.token,
        expiresAt: result.expiresAt,
        address: address.toLowerCase(),
      }

      setSession(sessionData)
      setHasPrompted(true)

      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData))
      }

      return sessionData
    } catch (error) {
      console.error('Failed to create session:', error)
      throw error
    } finally {
      setIsCreatingSession(false)
    }
  }

  const clearSession = () => {
    setSession(null)
    setHasPrompted(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY)
    }
  }

  const needsSession = address && !session && !hasPrompted

  return {
    session,
    isCreatingSession,
    createSession,
    clearSession,
    hasSession: !!session,
    needsSession,
    setHasPrompted,
  }
}
