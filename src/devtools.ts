import type { ModuleCustomTab } from '@nuxt/devtools-kit/types'
import type { Nuxt } from 'nuxt/schema'

// Better Auth logo as data URI (works in Nuxt DevTools sidebar)
const betterAuthLogo = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 45" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H15V15H30V30H15V45H0V30V15V0ZM45 30V15H30V0H45H60V15V30V45H45H30V30H45Z" fill="currentColor"/></svg>`)}`

export function setupDevTools(nuxt: Nuxt) {
  nuxt.hook('devtools:customTabs' as any, (tabs: ModuleCustomTab[]) => {
    tabs.push({
      category: 'server',
      name: 'better-auth',
      title: 'Auth',
      icon: betterAuthLogo,
      view: {
        type: 'iframe',
        src: '/__better-auth-devtools',
      },
    })
  })
}
