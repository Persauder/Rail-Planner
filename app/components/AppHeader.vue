<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <NuxtLink to="/" class="app-header__logo">
        <span class="app-header__mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M7 17h10M8.5 21l2-4m5 4-2-4M7 4.5h10a2 2 0 0 1 2 2V15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2Z" />
            <path d="M8 1.8h8M5 10h14M8.5 13.5h.01m6.99 0h.01" />
          </svg>
        </span>
        <span>Rail<span>Planner</span></span>
      </NuxtLink>

      <nav class="app-header__nav" aria-label="Main navigation">
        <NuxtLink to="/">Plan a journey</NuxtLink>
        <a href="#connections">Connections</a>
      </nav>

      <span class="app-header__status">
        <span aria-hidden="true" />
        Live schedules
      </span>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  position: relative;
  z-index: 10;
  border-bottom: 1px solid rgba(23, 45, 38, 0.1);
  background: rgba(248, 246, 239, 0.88);
  backdrop-filter: blur(14px);

  &__inner {
    min-height: 78px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
  }

  &__logo {
    display: inline-flex;
    align-items: center;
    gap: 11px;
    font-size: 1.15rem;
    font-weight: 750;
    letter-spacing: -0.03em;
    text-decoration: none;

    > span:last-child span {
      color: var(--green);
    }
  }

  &__mark {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: var(--ink);
    color: var(--lime);

    svg {
      width: 22px;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: 32px;
    margin-left: auto;

    a {
      color: var(--muted);
      font-size: 0.9rem;
      font-weight: 650;
      text-decoration: none;
      transition: color 160ms ease;
    }

    a:hover {
      color: var(--ink);
    }
  }

  &__status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 9px 13px;
    border: 1px solid var(--line);
    border-radius: 999px;
    color: var(--muted);
    font-size: 0.78rem;
    font-weight: 700;

    span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #38a169;
      box-shadow: 0 0 0 4px rgba(56, 161, 105, 0.12);
    }
  }
}

@media (max-width: 720px) {
  .app-header {
    &__inner {
      min-height: 68px;
    }

    &__nav,
    &__status {
      display: none;
    }
  }
}
</style>
