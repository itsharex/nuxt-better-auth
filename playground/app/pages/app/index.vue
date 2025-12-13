<script setup lang="ts">
const { user } = useUserSession()
</script>

<template>
  <div class="max-w-2xl mx-auto py-12 px-4">
    <h2 class="text-2xl font-semibold mb-4">Protected App Page</h2>
    <p class="text-muted-foreground mb-2">Welcome to the protected area, {{ user?.name }}!</p>
    <p class="text-muted-foreground">This page requires authentication.</p>
  </div>
</template>
