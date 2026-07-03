<script setup lang="ts">
import type { Connection } from "~/types/connection"

defineProps<{
  connection: Connection
}>()

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const restMinutes = minutes % 60
  return `${hours}h ${restMinutes}m`
}

const changeLabel = (changes: number) => {
  if (changes === 0) return "Direct"
  return changes === 1 ? "1 change" : `${changes} changes`
}
</script>

<template>
  <article class="connection-card">
    <div class="connection-card__carrier">
      <span class="connection-card__carrier-mark" aria-hidden="true">
        {{ connection.carrier.name.charAt(0) }}
      </span>
      <div>
        <p>{{ connection.carrier.name }}</p>
        <span>Intercity rail</span>
      </div>
    </div>

    <div class="connection-card__journey">
      <div class="connection-card__stop">
        <strong>{{ connection.departureTime }}</strong>
        <span>{{ connection.from.name }}</span>
      </div>

      <div class="connection-card__line" aria-hidden="true">
        <span />
        <div>
          <small>{{ formatDuration(connection.durationMinutes) }}</small>
          <i />
        </div>
        <span />
      </div>

      <div class="connection-card__stop connection-card__stop--arrival">
        <strong>{{ connection.arrivalTime }}</strong>
        <span>{{ connection.to.name }}</span>
      </div>
    </div>

    <div class="connection-card__fare">
      <span
          class="connection-card__badge"
          :class="{ 'connection-card__badge--direct': connection.changes === 0 }"
      >
        {{ changeLabel(connection.changes) }}
      </span>
      <p class="connection-card__price">
        <small>from</small>
        {{ connection.price.toFixed(2) }}
        <span>{{ connection.currency }}</span>
      </p>
    </div>

    <NuxtLink
        :to="`/connections/${connection.id}`"
        class="connection-card__link"
        :aria-label="`View details for connection from ${connection.from.name} to ${connection.to.name}`"
    >
      <span>View details</span>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12h14m-5-5 5 5-5 5" />
      </svg>
    </NuxtLink>
  </article>
</template>

<style scoped lang="scss">
.connection-card {
  display: grid;
  grid-template-columns: 150px minmax(330px, 1fr) auto 48px;
  gap: 28px;
  align-items: center;
  padding: 22px 24px;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 18px;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(30, 92, 69, 0.3);
    box-shadow: 0 16px 40px rgba(19, 39, 33, 0.08);
  }

  &__carrier {
    display: flex;
    align-items: center;
    gap: 11px;

    p {
      margin: 0;
      font-size: 0.86rem;
      font-weight: 800;
    }

    div > span {
      color: var(--muted);
      font-size: 0.72rem;
    }
  }

  &__carrier-mark {
    width: 38px;
    height: 38px;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: var(--soft-green);
    color: var(--green);
    font-weight: 850;
  }

  &__journey {
    display: grid;
    grid-template-columns: minmax(90px, auto) minmax(90px, 1fr) minmax(110px, auto);
    gap: 14px;
    align-items: center;
  }

  &__stop {
    display: grid;
    gap: 3px;

    strong {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 1.55rem;
      font-weight: 600;
      letter-spacing: -0.03em;
    }

    span {
      overflow: hidden;
      color: var(--muted);
      font-size: 0.72rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &--arrival {
      text-align: right;
    }
  }

  &__line {
    display: flex;
    align-items: center;
    width: 100%;

    > span {
      width: 7px;
      height: 7px;
      flex: 0 0 auto;
      border: 2px solid var(--green);
      border-radius: 50%;
      background: var(--paper);
    }

    div {
      position: relative;
      height: 28px;
      flex: 1;
      display: grid;
      place-items: center;
    }

    small {
      z-index: 1;
      padding: 0 6px;
      background: var(--paper);
      color: var(--muted);
      font-size: 0.68rem;
    }

    i {
      position: absolute;
      top: 50%;
      right: 0;
      left: 0;
      height: 1px;
      background: repeating-linear-gradient(90deg, var(--green) 0 5px, transparent 5px 9px);
    }
  }

  &__fare {
    min-width: 100px;
    text-align: right;
  }

  &__badge {
    display: inline-flex;
    margin-bottom: 7px;
    padding: 4px 8px;
    border-radius: 999px;
    background: #f3eee3;
    color: #806d47;
    font-size: 0.67rem;
    font-weight: 800;

    &--direct {
      background: var(--soft-green);
      color: var(--green);
    }
  }

  &__price {
    margin: 0;
    font-size: 1.08rem;
    font-weight: 850;

    small {
      display: block;
      color: var(--muted);
      font-size: 0.62rem;
      font-weight: 500;
    }

    span {
      color: var(--muted);
      font-size: 0.68rem;
    }
  }

  &__link {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--ink);
    color: #fff;
    text-decoration: none;
    transition: background 160ms ease, transform 160ms ease;

    span {
      display: none;
    }

    &:hover {
      transform: translateX(2px);
      background: var(--green);
    }

    svg {
      width: 18px;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }
}

@media (max-width: 900px) {
  .connection-card {
    grid-template-columns: 1fr auto;

    &__journey {
      grid-column: 1 / -1;
      grid-row: 1;
    }

    &__carrier,
    &__fare {
      grid-row: 2;
    }

    &__link {
      grid-column: 1 / -1;
      width: 100%;
      border-radius: 11px;

      span {
        display: inline;
      }

      svg {
        display: none;
      }
    }
  }
}

@media (max-width: 540px) {
  .connection-card {
    gap: 18px;
    padding: 18px;

    &__journey {
      grid-template-columns: auto 1fr auto;
      gap: 8px;
    }

    &__stop {
      max-width: 100px;

      strong {
        font-size: 1.35rem;
      }
    }
  }
}
</style>
