import { useState } from 'react'
import { useSession } from './useSession'

export function useGaslessAction() {
  const { session, createSession } = useSession()
  const [isPending, setIsPending] = useState(false)

  const executeGaslessAction = async (
    action: 'like' | 'unlike' | 'comment' | 'post',
    data: {
      secretId?: bigint
      content?: string
    }
  ) => {
    setIsPending(true)

    try {
      let currentSession = session

      if (!currentSession) {
        const stored = typeof window !== 'undefined'
          ? localStorage.getItem('confidee_session')
          : null

        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (parsed.expiresAt > Date.now()) {
              currentSession = parsed
            }
          } catch {
            // ignore parse error
          }
        }

        if (!currentSession) {
          try {
            currentSession = await createSession()
            if (!currentSession) {
              throw new Error('Failed to create session')
            }
          } catch {
            setIsPending(false)
            throw new Error('Please sign the message to enable gasless transactions')
          }
        }
      }

      const messageData = {
        secretId: data.secretId?.toString(),
        content: data.content,
      }

      const response = await fetch('/api/relayer/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          sessionToken: currentSession.token,
          data: messageData,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Transaction failed')
      }

      const result = await response.json()

      // Emit event to update rate limits UI
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('limitUpdate'))
      }

      setIsPending(false)
      return result
    } catch (error) {
      setIsPending(false)
      throw error
    }
  }

  return {
    executeGaslessAction,
    isPending,
  }
}
