import type { H3Event } from 'h3'
import type { AuthSession, AuthUser, RequireSessionOptions, UserMatch } from '../../types'
import { createError } from '#imports'

interface FullSession { user: AuthUser, session: AuthSession }

// Check if user matches all conditions (AND between fields, OR within array values)
function matchesUser(user: AuthUser, match: UserMatch<AuthUser>): boolean {
  for (const [key, expected] of Object.entries(match)) {
    const actual = (user as unknown as Record<string, unknown>)[key]
    if (Array.isArray(expected)) {
      if (!expected.includes(actual as never))
        return false
    }
    else {
      if (actual !== expected)
        return false
    }
  }
  return true
}

export async function getUserSession(event: H3Event): Promise<FullSession | null> {
  const auth = serverAuth()
  const session = await auth.api.getSession({ headers: event.headers })
  return session as FullSession | null
}

export async function requireUserSession(event: H3Event, options?: RequireSessionOptions): Promise<FullSession> {
  const session = await getUserSession(event)

  if (!session)
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })

  // Check user match conditions
  if (options?.user) {
    if (!matchesUser(session.user, options.user))
      throw createError({ statusCode: 403, statusMessage: 'Access denied' })
  }

  // Check custom rule callback
  if (options?.rule) {
    const allowed = await options.rule({ user: session.user, session: session.session })
    if (!allowed)
      throw createError({ statusCode: 403, statusMessage: 'Access denied' })
  }

  return session
}
