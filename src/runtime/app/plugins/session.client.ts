export default defineNuxtPlugin(async (nuxtApp) => {
  const { fetchSession } = useUserSession()

  if (!nuxtApp.payload.serverRendered) {
    // Pure CSR - fetch immediately
    await fetchSession()
  }
  else if (nuxtApp.payload.prerenderedAt || nuxtApp.payload.isCached) {
    // Prerendered/cached - defer to app:mounted to avoid hydration mismatch
    nuxtApp.hook('app:mounted', () => fetchSession())
  }
  // SSR pages: session already in payload from server plugin
})
