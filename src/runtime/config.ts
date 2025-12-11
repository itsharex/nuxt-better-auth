import type { BetterAuthOptions } from 'better-auth'
import type { ClientOptions } from 'better-auth/client'

export interface ServerAuthContext {
  runtimeConfig: any
  db: any
}

export interface ClientAuthContext {
  siteUrl: string
}

type ServerAuthConfig = Omit<BetterAuthOptions, 'database' | 'secret' | 'baseURL'>
type ClientAuthConfig = Omit<ClientOptions, 'baseURL'> & { baseURL?: string }

export type ServerAuthConfigFn = (ctx: ServerAuthContext) => ServerAuthConfig
export type ClientAuthConfigFn = (ctx: ClientAuthContext) => ClientAuthConfig

export function defineServerAuth(config: ServerAuthConfigFn): ServerAuthConfigFn {
  return config
}

export function defineClientAuth(config: ClientAuthConfigFn): ClientAuthConfigFn {
  return config
}
