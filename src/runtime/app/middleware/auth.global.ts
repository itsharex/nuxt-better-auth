import type { AuthMeta, AuthMode, AuthUser, UserMatch } from '../../types'
import { createError, defineNuxtRouteMiddleware, navigateTo, useRequestHeaders, useRuntimeConfig } from '#imports'

declare module '#app' {
  interface PageMeta {
    auth?: AuthMeta
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    auth?: AuthMeta
  }
}

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

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = to.meta.auth as AuthMeta | undefined

  // No auth meta = public page, skip auth checks
  if (auth === undefined || auth === false)
    return

  const config = useRuntimeConfig().public.auth as { redirects: { login: string, guest: string } } | undefined
  const { fetchSession, user, loggedIn, ready } = useUserSession()

  // Fetch session if not already loaded
  if (!loggedIn.value && !ready.value) {
    const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
    await fetchSession({ headers })
  }

  const mode: AuthMode = typeof auth === 'string' ? auth : auth?.only ?? 'user'
  const redirectTo = typeof auth === 'object' ? auth.redirectTo : undefined

  // Guest mode - only allow unauthenticated users
  if (mode === 'guest') {
    if (loggedIn.value)
      return navigateTo(redirectTo ?? config?.redirects?.guest ?? '/')
    return
  }

  // User mode - require authentication
  if (!loggedIn.value)
    return navigateTo(redirectTo ?? config?.redirects?.login ?? '/login')

  // Check user match conditions if specified
  if (typeof auth === 'object' && auth.user) {
    if (!user.value || !matchesUser(user.value, auth.user))
      throw createError({ statusCode: 403, statusMessage: 'Access denied' })
  }
})
