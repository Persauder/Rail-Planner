<script setup lang="ts">
useHead({
  title: "Rail Planner — Travel Poland by train",
  meta: [
    {
      name: "description",
      content: "Search direct train connections and compare travel times across Poland.",
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
