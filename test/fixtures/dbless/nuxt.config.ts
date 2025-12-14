export default defineNuxtConfig({
  modules: ['@nuxthub/core', '../../../src/module'],

  // No hub.db - database-less mode
  hub: { kv: true },

  runtimeConfig: {
    betterAuthSecret: 'test-secret-for-testing-only-32chars!',
    public: { siteUrl: '' },
  },

  auth: {
    redirects: { login: '/login', guest: '/' },
    secondaryStorage: true,
  },
})
