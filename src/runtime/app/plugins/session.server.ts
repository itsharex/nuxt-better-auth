export default defineNuxtPlugin({
  name: 'auth:session-fetch',
  enforce: 'pre',
  async setup(nuxtApp) {
    nuxtApp.payload.isCached = Boolean(useRequestEvent()?.context.cache)
    // Only fetch if SSR (not prerendered, not cached)
    if (nuxtApp.payload.serverRendered && !nuxtApp.payload.prerenderedAt && !nuxtApp.payload.isCached)
      await useUserSession().fetchSession()
  },
})
