import createServerAuth from '#auth/server'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

type AuthInstance = ReturnType<typeof betterAuth>
let _auth: AuthInstance | undefined

export function serverAuth(): AuthInstance {
  if (_auth)
    return _auth

  const runtimeConfig = useRuntimeConfig()

  // Get database instance - user must provide via runtimeConfig or global
  // For NuxtHub: import { db } from 'hub:db'
  // For other setups: user configures in their auth.config.ts
  const db = (globalThis as any).__nuxt_better_auth_db

  if (!db) {
    throw new Error('[nuxt-better-auth] Database not configured. Set globalThis.__nuxt_better_auth_db or configure in your server/auth.config.ts')
  }

  // User's config function receives context
  const userConfig = createServerAuth({ runtimeConfig, db })

  // Library adds database adapter, secret, baseURL
  _auth = betterAuth({
    ...userConfig,
    database: drizzleAdapter(db, { provider: 'sqlite' }),
    secret: runtimeConfig.betterAuthSecret,
    baseURL: runtimeConfig.public.siteUrl,
  })

  return _auth
}
