<script setup lang="ts">
const { user } = useUserSession()
const { hasAccess, paywallConfig } = usePageAccess()
</script>

<template>
  <div>
    <template v-if="hasAccess">
      <h2>Admin Dashboard</h2>
      <p>Welcome, admin {{ user?.name }}!</p>
      <p>This page is only accessible to admins.</p>
    </template>

    <template v-else>
      <h2>{{ paywallConfig.title }}</h2>
      <p>{{ paywallConfig.description }}</p>
    </template>
  </div>
</template>
