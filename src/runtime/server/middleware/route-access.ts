import type { AuthRouteRules, RoleName } from '../../types'

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/'))
    return

  const routeRules = getRouteRules(event)
  if (!routeRules)
    return

  const rules = routeRules as AuthRouteRules
  const options: { role?: RoleName | RoleName[], tier?: string | string[] } = {}

  if (rules.role)
    options.role = rules.role
  if (rules.requiresAdmin)
    options.role = 'admin'
  if (rules.tier)
    options.tier = rules.tier

  if (Object.keys(options).length > 0)
    await requireUserSession(event, options)
})
