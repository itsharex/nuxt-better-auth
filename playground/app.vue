<script setup lang="ts">
const { user, loggedIn, ready, signOut } = useUserSession()
</script>

<template>
  <div class="container">
    <h1>Nuxt Better Auth Playground</h1>

    <div v-if="!ready" class="loading">
      Loading auth state...
    </div>

    <template v-else>
      <div v-if="loggedIn" class="user-info">
        <p>Welcome, <strong>{{ user?.name || user?.email }}</strong>!</p>
        <p>Role: {{ user?.role || 'user' }}</p>
        <button @click="signOut()">
          Sign Out
        </button>
      </div>

      <div v-else class="auth-forms">
        <NuxtLink to="/login">
          Go to Login
        </NuxtLink>
      </div>
    </template>

    <nav>
      <NuxtLink to="/">
        Home
      </NuxtLink>
      <NuxtLink to="/app">
        Protected App
      </NuxtLink>
      <NuxtLink to="/admin">
        Admin Only
      </NuxtLink>
    </nav>

    <NuxtPage />
  </div>
</template>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, sans-serif;
}
nav {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
}
nav a {
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border-radius: 4px;
  text-decoration: none;
  color: inherit;
}
nav a:hover {
  background: #e0e0e0;
}
.loading {
  color: #666;
}
button {
  padding: 0.5rem 1rem;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #555;
}
</style>
