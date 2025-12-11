import type { AppAuthClient } from '#auth/client'
import type { AuthSession, AuthUser } from '#nuxt-better-auth'
import { createAppAuthClient } from '#auth/client'
import { consola } from 'consola'

export function useUserSession() {
  const runtimeConfig = useRuntimeConfig()

  // Create properly typed client from user's config
  const client: AppAuthClient = createAppAuthClient(runtimeConfig.public.siteUrl)

  const session = useState<AuthSession | null>('auth:session', () => null)
  const user = useState<AuthUser | null>('auth:user', () => null)
  const sessionFetching = useState('auth:sessionFetching', () => false)
  const authReady = useState('auth:ready', () => false)
  const ready = computed(() => authReady.value)
  const loggedIn = computed(() => Boolean(session.value && user.value))

  function clearSession() {
    session.value = null
    user.value = null
  }

  function updateUser(updates: Partial<AuthUser>) {
    if (user.value)
      user.value = { ...user.value, ...updates }
  }

  async function fetchSession(options: { headers?: HeadersInit, force?: boolean } = {}) {
    if (sessionFetching.value && !options.force)
      return

    const headers = options.headers || (import.meta.server ? useRequestHeaders(['cookie']) : undefined)

    sessionFetching.value = true
    try {
      const fetchOptions = headers ? { headers } : undefined
      const { data } = await client.getSession({}, fetchOptions)
      if (data?.session && data?.user) {
        session.value = data.session as AuthSession
        user.value = data.user as AuthUser
      }
      else {
        clearSession()
      }
    }
    catch (error) {
      clearSession()
      if (import.meta.dev)
        consola.error('Failed to fetch auth session:', error)
    }
    finally {
      sessionFetching.value = false
      if (!authReady.value)
        authReady.value = true
    }
  }

  async function signOut(...args: Parameters<typeof client.signOut>) {
    const response = await client.signOut(...args)
    clearSession()
    return response
  }

  return {
    // Core state
    client,
    session,
    user,
    loggedIn,
    ready,
    // Methods
    signIn: client.signIn,
    signUp: client.signUp,
    signOut,
    fetchSession,
    updateUser,
  }
}
