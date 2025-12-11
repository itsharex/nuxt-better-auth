import type { AuthMeta, AuthMode, RoleName } from '../../types'

declare module '#app' {
  interface PageMeta {
    auth?: AuthMeta
    tier?: string | string[]
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    auth?: AuthMeta
    tier?: string | string[]
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = to.meta.auth as AuthMeta | undefined

  if (auth === false)
    return

  const { fetchSession, user, loggedIn } = useUserSession()

  if (!loggedIn.value) {
    const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
    await fetchSession({ headers })
  }

  if (loggedIn.value && user.value?.banned)
    throw createError({ statusCode: 403, statusMessage: 'Account suspended', data: { banned: true } })

  const mode: AuthMode = typeof auth === 'string' ? auth : auth?.only ?? 'user'

  if (mode === 'guest') {
    if (loggedIn.value) {
      const redirectTarget = typeof auth === 'object' && auth.redirectTo ? auth.redirectTo : '/'
      return navigateTo(redirectTarget)
    }
    return
  }

  if (!loggedIn.value)
    return navigateTo('/login')

  const requiredRole = typeof auth === 'object' ? auth.role : undefined
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!user.value || !allowedRoles.includes(user.value.role as RoleName)) {
      if (import.meta.dev) {
        useState('dev-role-bypass', () => true).value = true
      }
      else {
        throw createError({ statusCode: 403, statusMessage: 'Access denied' })
      }
    }
    else {
      useState('dev-role-bypass', () => false).value = false
    }
  }

  // Tier-based access is handled by usePageAccess - middleware just ensures auth
  // User implements tier checks in their own composables/components
})
