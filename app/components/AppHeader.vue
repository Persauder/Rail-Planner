<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <NuxtLink to="/" class="app-header__logo">
        Rail Planner
      </NuxtLink>

      <span class="app-header__tagline">
        Simple train connection search
      </span>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  background: #ffffff;
  border-bottom: 1px solid #e1e7f0;

  &__inner {
    min-height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  &__logo {
    font-weight: 800;
    font-size: 1.25rem;
    text-decoration: none;
  }

  &__tagline {
    color: #667085;
    font-size: 0.95rem;
  }
}
</style>