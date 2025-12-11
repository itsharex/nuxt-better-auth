import type { NitroRouteRules } from 'nitropack'

// Re-export augmentable types
export type { AuthExtensions, AuthSession, AuthUser, UserSessionComposable } from './types/augment'

// Role type - users can extend via AuthExtensions
export type RoleName = 'admin' | 'user' | (string & {})
export type AuthMode = 'guest' | 'user'

// Route auth meta - minimal, no payment-specific fields
export type AuthMeta = false | AuthMode | {
  only?: AuthMode
  redirectTo?: string
  role?: RoleName | RoleName[]
}

// Route rules - extensible via tier for custom access levels
export type AuthRouteRules = NitroRouteRules & {
  auth?: AuthMeta
  requiresAdmin?: boolean
  role?: RoleName | RoleName[]
  // Generic tier system - user defines what tiers mean
  tier?: string | string[]
}

declare module 'nitropack' {
  interface NitroRouteRules {
    auth?: AuthMeta
    requiresAdmin?: boolean
    role?: RoleName | RoleName[]
    tier?: string | string[]
  }
}
