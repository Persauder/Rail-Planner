<script setup lang="ts">
const route = useRoute()
const { getConnectionById } = useConnections()

const id = String(route.params.id)

const { data: connection, pending, error } = await useAsyncData(
    `connection-${id}`,
    () => getConnectionById(id)
)

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const restMinutes = minutes % 60

  return `${hours}h ${restMinutes}m`
}
</script>

<template>
  <section class="page">
    <div class="container">
      <NuxtLink to="/" class="back-link">
        ← Back to search
      </NuxtLink>

      <p v-if="pending">
        Loading connection details...
      </p>

      <p v-else-if="error">
        Connection not found.
      </p>

      <article v-else-if="connection" class="details">
        <p class="details__eyebrow">
          {{ connection.carrier.name }}
        </p>

        <h1>
          {{ connection.from.name }} → {{ connection.to.name }}
        </h1>

        <dl class="details__grid">
          <div>
            <dt>Departure</dt>
            <dd>{{ connection.departureTime }}</dd>
          </div>

          <div>
            <dt>Arrival</dt>
            <dd>{{ connection.arrivalTime }}</dd>
          </div>

          <div>
            <dt>Duration</dt>
            <dd>{{ formatDuration(connection.durationMinutes) }}</dd>
          </div>

          <div>
            <dt>Changes</dt>
            <dd>{{ connection.changes }}</dd>
          </div>

          <div>
            <dt>Price</dt>
            <dd>{{ connection.price.toFixed(2) }} {{ connection.currency }}</dd>
          </div>
        </dl>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
.back-link {
  display: inline-flex;
  margin-bottom: 24px;
  color: #1f5f99;
  font-weight: 700;
  text-decoration: none;
}

.details {
  padding: 28px;
  background: #ffffff;
  border: 1px solid #e1e7f0;
  border-radius: 22px;

  &__eyebrow {
    margin: 0 0 8px;
    color: #2b6cb0;
    font-weight: 800;
  }

  h1 {
    margin: 0 0 24px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin: 0;
  }

  dt {
    color: #667085;
    font-size: 0.9rem;
  }

  dd {
    margin: 6px 0 0;
    font-weight: 800;
  }
}

@media (max-width: 760px) {
  .details__grid {
    grid-template-columns: 1fr;
  }
}
</style>