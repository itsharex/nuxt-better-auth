<script setup lang="ts">
const { user, loggedIn, ready, signOut } = useUserSession()
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <NuxtLink to="/" class="text-xl font-semibold text-foreground">
            BETTER-AUTH.
          </NuxtLink>
          <div class="flex items-center gap-4">
            <nav class="flex items-center gap-4">
              <NuxtLink to="/" class="text-sm text-muted-foreground hover:text-foreground">Home</NuxtLink>
              <NuxtLink to="/app" class="text-sm text-muted-foreground hover:text-foreground">App</NuxtLink>
              <NuxtLink to="/admin" class="text-sm text-muted-foreground hover:text-foreground">Admin</NuxtLink>
            </nav>
            <UColorModeButton />
            <template v-if="ready">
              <template v-if="loggedIn">
                <span class="text-sm text-muted-foreground">{{ user?.name || user?.email }}</span>
                <button
                  class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                  @click="signOut()"
                >
                  Sign Out
                </button>
              </template>
              <template v-else>
                <NuxtLink to="/login">
                  <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                    Sign In
                  </button>
                </NuxtLink>
              </template>
            </template>
          </div>
        </div>
      </div>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>
