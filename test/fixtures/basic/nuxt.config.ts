export default defineNuxtConfig({
  modules: ['@nuxthub/core', '../../../src/module'],

  hub: { db: 'sqlite' },

  runtimeConfig: {
    betterAuthSecret: 'test-secret-for-testing-only-32chars!',
    public: { siteUrl: '' },
  },

  auth: {
    redirects: {
      login: '/login',
      guest: '/',
    },
  },

  routeRules: {
    '/protected': { auth: 'user' },
    '/admin': { auth: { user: { role: 'admin' } } },
    '/login': { auth: 'guest' },
  },
})
