type SessionData = {
  address: string
  expiresAt: number
}

declare global {
  var __sessionStore: Map<string, SessionData> | undefined
}

const sessionStore = globalThis.__sessionStore ?? new Map<string, SessionData>()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__sessionStore = sessionStore
}

export function setSession(token: string, data: SessionData) {
  sessionStore.set(token, data)
  console.log('[SESSION STORE] Set session. Total sessions:', sessionStore.size)
}

export function getSession(token: string): SessionData | null {
  console.log('[SESSION STORE] Get session. Total sessions:', sessionStore.size)
  const session = sessionStore.get(token)

  if (!session) {
    return null
  }

  if (session.expiresAt < Date.now()) {
    sessionStore.delete(token)
    return null
  }

  return session
}

export function deleteSession(token: string) {
  sessionStore.delete(token)
}

export function cleanExpiredSessions() {
  const now = Date.now()
  for (const [token, session] of sessionStore.entries()) {
    if (session.expiresAt < now) {
      sessionStore.delete(token)
    }
  }
}
