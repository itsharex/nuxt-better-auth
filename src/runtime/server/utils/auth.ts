import createServerAuth from '#auth/server'
import { useEvent, useRuntimeConfig } from '#imports'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { getRequestURL } from 'h3'
import { db, schema } from 'hub:db'

type AuthInstance = ReturnType<typeof betterAuth>
let _auth: AuthInstance | undefined

function getBaseURL(siteUrl?: string): string {
  if (siteUrl)
    return siteUrl

  // Fallback: detect from current request
  try {
    const event = useEvent()
    return getRequestURL(event).origin
  }
  catch {
    return ''
  }
}

let _kv: typeof import('hub:kv').kv | undefined

async function getKV() {
  if (!_kv) {
    const { kv } = await import('hub:kv')
    _kv = kv
  }
  return _kv
}

function createSecondaryStorage() {
  return {
    get: async (key: string) => (await getKV()).get(`_auth:${key}`),
    set: async (key: string, value: unknown, ttl?: number) => (await getKV()).set(`_auth:${key}`, value, { ttl }),
    delete: async (key: string) => (await getKV()).del(`_auth:${key}`),
  }
}

export function serverAuth(): AuthInstance {
  if (_auth)
    return _auth

  const runtimeConfig = useRuntimeConfig()
  const authConfig = runtimeConfig.auth as { secondaryStorage?: boolean } | undefined

  // User's config function receives context with db
  const userConfig = createServerAuth({ runtimeConfig, db })

  _auth = betterAuth({
    ...userConfig,
    database: drizzleAdapter(db, { provider: 'sqlite', schema }),
    secondaryStorage: authConfig?.secondaryStorage ? createSecondaryStorage() : undefined,
    secret: runtimeConfig.betterAuthSecret,
    baseURL: getBaseURL(runtimeConfig.public.siteUrl as string | undefined),
  })

  return _auth
}
