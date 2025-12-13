<script setup lang="ts">
const { user } = useUserSession()
</script>

<template>
  <div class="max-w-2xl mx-auto py-12 px-4">
    <h2 class="text-2xl font-semibold mb-4">Admin Dashboard</h2>
    <p class="text-muted-foreground mb-2">Welcome, admin {{ user?.name }}!</p>
    <p class="text-muted-foreground">This page is only accessible to admins.</p>
  </div>
</template>
