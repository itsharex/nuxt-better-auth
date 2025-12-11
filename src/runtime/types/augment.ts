// Base types that users extend via module augmentation
// Users add fields in: shared/types/auth.d.ts

import type { ComputedRef, Ref } from 'vue'

// Base user - extend with plugin fields
export interface AuthUser {
  id: string
  createdAt: Date
  updatedAt: Date
  email: string
  emailVerified: boolean
  name: string
  image?: string | null
}

// Base session
export interface AuthSession {
  id: string
  createdAt: Date
  updatedAt: Date
  userId: string
  expiresAt: Date
  token: string
  ipAddress?: string | null
  userAgent?: string | null
}

// Auth configuration - extend with custom tiers, payment logic, etc.
export interface AuthExtensions {
  // User defines functions like: isPremium: (user) => boolean
}

// Composable return type
export interface UserSessionComposable {
  user: Ref<AuthUser | null>
  session: Ref<AuthSession | null>
  loggedIn: ComputedRef<boolean>
  ready: ComputedRef<boolean>
  client: unknown
  signIn: unknown
  signUp: unknown
  signOut: (...args: unknown[]) => Promise<unknown>
  fetchSession: (options?: { headers?: HeadersInit, force?: boolean }) => Promise<void>
  updateUser: (updates: Partial<AuthUser>) => void
}
