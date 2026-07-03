<script setup lang="ts">
const route = useRoute()
const { getConnectionById } = useConnections()
const id = String(route.params.id)

const { data: connection, pending, error } = await useAsyncData(
  `connection-${id}`,
  () => getConnectionById(id),
)

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const restMinutes = minutes % 60
  return `${hours}h ${restMinutes}m`
}
</script>

<template>
  <main class="page">
    <div class="container">
      <NuxtLink to="/" class="back-link">
        <span aria-hidden="true">←</span> Back to search
      </NuxtLink>

      <div v-if="pending" class="page__state">Loading connection details…</div>
      <div v-else-if="error" class="page__state">Connection not found.</div>

      <article v-else-if="connection" class="details">
        <header class="details__header">
          <div>
            <p class="details__eyebrow">{{ connection.carrier.name }} · Train connection</p>
            <h1>{{ connection.from.city }} <em>to</em> {{ connection.to.city }}</h1>
          </div>
          <span class="details__status">
            {{ connection.changes === 0 ? "Direct service" : `${connection.changes} change` }}
          </span>
        </header>

        <div class="details__journey">
          <div class="details__station">
            <strong>{{ connection.departureTime }}</strong>
            <span>{{ connection.from.name }}</span>
          </div>
          <div class="details__line">
            <span />
            <div>
              <small>{{ formatDuration(connection.durationMinutes) }}</small>
              <i />
            </div>
            <span />
          </div>
          <div class="details__station details__station--arrival">
            <strong>{{ connection.arrivalTime }}</strong>
            <span>{{ connection.to.name }}</span>
          </div>
        </div>

        <footer class="details__footer">
          <div>
            <span>Operator</span>
            <strong>{{ connection.carrier.name }}</strong>
          </div>
          <div>
            <span>Journey type</span>
            <strong>{{ connection.changes === 0 ? "Direct" : `${connection.changes} change` }}</strong>
          </div>
          <div class="details__price">
            <span>Total fare</span>
            <strong>{{ connection.price.toFixed(2) }} <small>{{ connection.currency }}</small></strong>
          </div>
        </footer>
      </article>
    </div>
  </main>
</template>

<style scoped lang="scss">
.page {
  min-height: calc(100vh - 78px);
  padding: 64px 0;
  background:
    radial-gradient(circle at 80% 0, rgba(205, 234, 91, 0.16), transparent 30%),
    var(--canvas);

  &__state {
    padding: 70px;
    border: 1px dashed var(--line);
    border-radius: 20px;
    color: var(--muted);
    text-align: center;
  }
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
  color: var(--green);
  font-weight: 700;
  text-decoration: none;
}

.details {
  overflow: hidden;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 24px;
  box-shadow: 0 28px 80px rgba(19, 39, 33, 0.1);

  &__eyebrow {
    margin: 0 0 12px;
    color: var(--green);
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  &__header {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 24px;
    padding: 34px;
  }

  h1 {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(2.3rem, 5vw, 4.4rem);
    font-weight: 500;
    letter-spacing: -0.05em;

    em {
      color: var(--green);
      font-size: 0.48em;
      font-weight: 500;
    }
  }

  &__status {
    padding: 8px 12px;
    border-radius: 999px;
    background: var(--soft-green);
    color: var(--green);
    font-size: 0.72rem;
    font-weight: 800;
  }

  &__journey {
    display: grid;
    grid-template-columns: auto minmax(150px, 1fr) auto;
    gap: 24px;
    align-items: center;
    margin: 0 34px;
    padding: 42px 0;
    border-top: 1px solid var(--line);
  }

  &__station {
    display: grid;
    gap: 6px;

    strong {
      font-family: Georgia, "Times New Roman", serif;
      font-size: clamp(2rem, 5vw, 4rem);
      font-weight: 500;
      letter-spacing: -0.04em;
    }

    span {
      color: var(--muted);
      font-size: 0.82rem;
    }

    &--arrival {
      text-align: right;
    }
  }

  &__line {
    display: flex;
    align-items: center;

    > span {
      width: 10px;
      height: 10px;
      border: 2px solid var(--green);
      border-radius: 50%;
    }

    div {
      position: relative;
      flex: 1;
      display: grid;
      place-items: center;
    }

    small {
      z-index: 1;
      padding: 0 12px;
      background: var(--paper);
      color: var(--muted);
    }

    i {
      position: absolute;
      top: 50%;
      right: 0;
      left: 0;
      height: 1px;
      background: repeating-linear-gradient(90deg, var(--green) 0 6px, transparent 6px 11px);
    }
  }

  &__footer {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 24px;
    padding: 24px 34px;
    background: var(--ink);
    color: #fff;

    div {
      display: grid;
      gap: 5px;
    }

    span {
      color: rgba(255, 255, 255, 0.48);
      font-size: 0.7rem;
    }

    strong {
      font-size: 0.9rem;
    }
  }

  &__price {
    text-align: right;

    strong {
      color: var(--lime);
      font-size: 1.35rem;
    }

    small {
      font-size: 0.65rem;
    }
  }
}

@media (max-width: 760px) {
  .page {
    padding: 36px 0;
  }

  .details {
    &__header {
      flex-direction: column;
      padding: 24px;
    }

    &__journey {
      grid-template-columns: auto 1fr auto;
      gap: 10px;
      margin: 0 24px;
      padding: 32px 0;
    }

    &__station {
      max-width: 105px;
    }

    &__footer {
      grid-template-columns: 1fr 1fr;
      padding: 22px 24px;
    }

    &__price {
      grid-column: 1 / -1;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      text-align: left;
    }
  }
}
</style>
