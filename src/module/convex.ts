import type { Nuxt } from '@nuxt/schema'

export function resolveConvexUrl(nuxt: Nuxt, explicitConvexUrl?: string): string {
  if (explicitConvexUrl)
    return explicitConvexUrl

  const convexConfig = (nuxt.options as { convex?: { url?: string } }).convex
  if (convexConfig?.url)
    return convexConfig.url

  const runtimeUrl = (nuxt.options.runtimeConfig.public as { convex?: { url?: string } })?.convex?.url
  if (runtimeUrl)
    return runtimeUrl

  if (process.env.CONVEX_URL)
    return process.env.CONVEX_URL

  if (process.env.NUXT_PUBLIC_CONVEX_URL)
    return process.env.NUXT_PUBLIC_CONVEX_URL

  return ''
}
