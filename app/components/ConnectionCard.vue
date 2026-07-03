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
</script>

<template>
  <article class="connection-card">
    <div>
      <p class="connection-card__route">
        {{ connection.from.name }} → {{ connection.to.name }}
      </p>

      <p class="connection-card__carrier">
        {{ connection.carrier.name }}
      </p>
    </div>

    <div class="connection-card__time">
      <strong>{{ connection.departureTime }}</strong>
      <span>→</span>
      <strong>{{ connection.arrivalTime }}</strong>
    </div>

    <div>
      <p class="connection-card__price">
        {{ connection.price.toFixed(2) }} {{ connection.currency }}
      </p>

      <p class="connection-card__meta">
        {{ formatDuration(connection.durationMinutes) }},
        {{ connection.changes === 0 ? "direct" : `${connection.changes} change(s)` }}
      </p>
    </div>

    <NuxtLink
        :to="`/connections/${connection.id}`"
        class="connection-card__link"
        :aria-label="`View details for connection from ${connection.from.name} to ${connection.to.name}`"
    >
      Details
    </NuxtLink>
  </article>
</template>

<style scoped lang="scss">
.connection-card {
  display: grid;
  grid-template-columns: 1.5fr auto 1fr auto;
  gap: 20px;
  align-items: center;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e1e7f0;
  border-radius: 18px;

  &__route {
    margin: 0;
    font-weight: 800;
  }

  &__carrier,
  &__meta {
    margin: 6px 0 0;
    color: #667085;
  }

  &__time {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__price {
    margin: 0;
    font-weight: 800;
  }

  &__link {
    padding: 10px 14px;
    border-radius: 999px;
    background: #edf4ff;
    color: #1f5f99;
    font-weight: 700;
    text-decoration: none;
  }
}

@media (max-width: 760px) {
  .connection-card {
    grid-template-columns: 1fr;
  }
}
</style>