import type { NuxtPage } from '@nuxt/schema'
import type { AuthRouteRules } from './runtime/types'
import { existsSync } from 'node:fs'
import { addComponentsDir, addImportsDir, addPlugin, addServerHandler, addServerImportsDir, addServerScanDir, addTypeTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import { defu } from 'defu'
import { createRouter, toRouteMatcher } from 'radix3'

type AuthRouteRule = AuthRouteRules & { swr?: boolean | number }

export default defineNuxtModule({
  meta: { name: 'nuxt-better-auth', configKey: 'auth', compatibility: { nuxt: '>=3.0.0' } },
  setup(_, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Validate user config files exist
    const serverConfigPath = resolver.resolve(nuxt.options.rootDir, 'server/auth.config')
    const clientConfigPath = resolver.resolve(nuxt.options.rootDir, 'app/auth.client')

    const serverConfigExists = existsSync(`${serverConfigPath}.ts`) || existsSync(`${serverConfigPath}.js`)
    const clientConfigExists = existsSync(`${clientConfigPath}.ts`) || existsSync(`${clientConfigPath}.js`)

    if (!serverConfigExists)
      throw new Error('[nuxt-better-auth] Missing server/auth.config.ts - create with defineServerAuth()')
    if (!clientConfigExists)
      throw new Error('[nuxt-better-auth] Missing app/auth.client.ts - export createAppAuthClient()')

    // Register #nuxt-better-auth alias for type augmentation
    nuxt.options.alias['#nuxt-better-auth'] = resolver.resolve('./runtime/types/augment')

    // Register aliases for user config files
    nuxt.options.alias['#auth/server'] = serverConfigPath
    nuxt.options.alias['#auth/client'] = clientConfigPath

    // Add type template for #nuxt-better-auth module augmentation
    addTypeTemplate({
      filename: 'types/nuxt-better-auth.d.ts',
      getContents: () => `
// Type augmentation support
export * from '${resolver.resolve('./runtime/types/augment')}'
export type { AuthMeta, AuthMode, AuthRouteRules, RoleName } from '${resolver.resolve('./runtime/types')}'
`,
    })

    // Auto-import server utils (serverAuth, getUserSession, requireUserSession)
    addServerImportsDir(resolver.resolve('./runtime/server/utils'))

    // Register server middleware
    addServerScanDir(resolver.resolve('./runtime/server/middleware'))

    // Register auth API handler
    addServerHandler({ route: '/api/auth/**', handler: resolver.resolve('./runtime/server/api/auth/[...all]') })

    // Auto-import client composables
    addImportsDir(resolver.resolve('./runtime/app/composables'))

    // Register session plugins
    addPlugin({ src: resolver.resolve('./runtime/app/plugins/session.server'), mode: 'server' })
    addPlugin({ src: resolver.resolve('./runtime/app/plugins/session.client'), mode: 'client' })

    // Register auth components
    addComponentsDir({ path: resolver.resolve('./runtime/app/components') })

    // Register client middleware
    nuxt.hook('app:resolve', (app) => {
      app.middleware.push({ name: 'auth', path: resolver.resolve('./runtime/app/middleware/auth.global'), global: true })
    })

    // Sync routeRules to page meta
    nuxt.hook('pages:extend', (pages) => {
      const routeRules = (nuxt.options.routeRules || {}) as Record<string, AuthRouteRule>
      if (!Object.keys(routeRules).length)
        return

      const matcher = toRouteMatcher(createRouter({ routes: routeRules }))

      const applyMetaFromRules = (page: NuxtPage) => {
        const matches = matcher.matchAll(page.path) as Partial<AuthRouteRule>[]
        if (!matches.length)
          return

        const matchedRules = defu({}, ...matches.reverse()) as AuthRouteRule

        if (matchedRules.auth !== undefined || matchedRules.tier || matchedRules.requiresAdmin || matchedRules.role) {
          page.meta = page.meta || {}
          if (matchedRules.auth !== undefined)
            page.meta.auth = matchedRules.auth
          if (matchedRules.tier)
            page.meta.tier = matchedRules.tier
          if (matchedRules.requiresAdmin)
            page.meta.requiresAdmin = true
          if (matchedRules.role)
            page.meta.role = matchedRules.role
        }

        page.children?.forEach(child => applyMetaFromRules(child))
      }

      pages.forEach(page => applyMetaFromRules(page))
    })
  },
})

// Re-export config helpers
export { defineClientAuth, defineServerAuth } from './runtime/config'
export type { AuthMeta, AuthMode, AuthRouteRules, AuthSession, AuthUser, RoleName } from './runtime/types'
