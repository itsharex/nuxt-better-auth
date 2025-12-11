export function usePageAccess() {
  const route = useRoute()
  const { user, loggedIn } = useUserSession()

  // Check role-based access
  const hasAccess = computed(() => {
    // Admin check (shorthand for role: 'admin')
    if (route.meta.requiresAdmin && user.value?.role !== 'admin')
      return false

    // Role check
    if (route.meta.role) {
      if (!loggedIn.value)
        return false
      const allowedRoles = (Array.isArray(route.meta.role) ? route.meta.role : [route.meta.role]) as string[]
      const userRole = user.value?.role as string | undefined
      if (!userRole || !allowedRoles.includes(userRole))
        return false
    }

    // Tier check - user implements tier logic in their own composable
    // Module just exposes the tier metadata, doesn't assume payment provider
    if (route.meta.tier) {
      // User should extend this with their own tier checking logic
      // e.g., by wrapping usePageAccess or using a custom composable
    }

    return true
  })

  const showPaywall = computed(() => !hasAccess.value && (route.meta.tier || route.meta.requiresAdmin || route.meta.role))

  const paywallConfig = computed(() => {
    if (hasAccess.value)
      return { title: '', description: '' }
    if (route.meta.requiresAdmin)
      return { title: 'Admin only', description: 'This page is for administrators.' }
    if (route.meta.tier)
      return { title: 'Upgrade required', description: 'You need a higher tier to access this feature.' }
    return { title: 'Access restricted', description: 'You do not have access to this feature.' }
  })

  return { hasAccess, showPaywall, paywallConfig }
}
