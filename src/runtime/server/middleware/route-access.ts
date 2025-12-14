import type { AuthMeta, AuthMode, AuthRouteRules, AuthUser, UserMatch } from '../../types'
import { createError, defineEventHandler, getRequestPath, getRouteRules } from '#imports'

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

export default defineEventHandler(async (event) => {
  const path = getRequestPath(event)

  // Only apply to API routes
  if (!path.startsWith('/api/'))
    return

  // Skip auth API routes
  if (path.startsWith('/api/auth/'))
    return

  const rules = getRouteRules(event) as AuthRouteRules
  if (!rules.auth)
    return

  const auth: AuthMeta = rules.auth
  const mode: AuthMode = typeof auth === 'string' ? auth : auth?.only ?? 'user'

  // Guest mode - only allow unauthenticated users
  if (mode === 'guest') {
    const session = await getUserSession(event)
    if (session)
      throw createError({ statusCode: 403, statusMessage: 'Authenticated users not allowed' })
    return
  }

  // User mode - require authentication
  if (mode === 'user') {
    const session = await requireUserSession(event)

    // Check user match conditions if specified
    if (typeof auth === 'object' && auth.user) {
      if (!matchesUser(session.user, auth.user))
        throw createError({ statusCode: 403, statusMessage: 'Access denied' })
    }
  }
})
