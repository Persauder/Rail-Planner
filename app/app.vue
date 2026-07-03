<script setup lang="ts">
useHead({
  title: "Rail Planner — Travel Poland by train",
  meta: [
    {
      name: "description",
      content: "Compare train connections, travel times and fares across Poland.",
    },
  ],
})
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <NuxtPage />
  </div>
</template>
