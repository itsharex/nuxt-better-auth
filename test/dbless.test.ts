import { fileURLToPath } from 'node:url'
import { $fetch, setup } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('database-less mode', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/dbless', import.meta.url)),
  })

  it('renders home page without database', async () => {
    const html = await $fetch('/')
    expect(html).toContain('Database-less Mode')
  })

  it('auth API responds without database', async () => {
    const response = await $fetch('/api/auth/ok')
    expect(response).toBeDefined()
  })
})
