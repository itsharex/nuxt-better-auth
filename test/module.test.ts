import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('nuxt-better-auth module', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  describe('page rendering', () => {
    it('renders home page with BetterAuthState component', async () => {
      const html = await $fetch('/')
      expect(html).toContain('Home')
      // BetterAuthState shows placeholder during SSR (ready=false)
      expect(html).toContain('Loading auth...')
    })
  })

  describe('route protection', () => {
    it('redirects unauthenticated users from protected routes', async () => {
      const html = await $fetch('/protected')
      expect(html).toContain('login')
    })

    it('allows access to guest routes when unauthenticated', async () => {
      const html = await $fetch('/login')
      expect(html).toContain('Login')
    })
  })
})
