<script setup lang="ts">
import type { Connection } from "~/types/connection"

const { searchConnections } = useConnections()

const connections = ref<Connection[]>([])
const isLoading = ref(false)
const errorMessage = ref("")

const handleSearch = async (params: { from: string; to: string }) => {
  isLoading.value = true
  errorMessage.value = ""

  try {
    connections.value = await searchConnections(params)
  } catch {
    errorMessage.value = "Something went wrong. Please try again."
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  handleSearch({
    from: "Kraków",
    to: "Warszawa",
  })
})
</script>

<template>
  <section class="page">
    <div class="container">
      <div class="hero">
        <p class="hero__eyebrow">Train journey planner</p>

        <h1>Find a train connection in seconds</h1>

        <p class="hero__description">
          Search available train connections, compare prices and check travel details.
        </p>
      </div>

      <SearchForm @search="handleSearch" />

      <div class="results" aria-live="polite">
        <p v-if="isLoading">
          Loading connections...
        </p>

        <p v-else-if="errorMessage">
          {{ errorMessage }}
        </p>

        <p v-else-if="connections.length === 0">
          No connections found.
        </p>

        <div v-else class="results__list">
          <ConnectionCard
              v-for="connection in connections"
              :key="connection.id"
              :connection="connection"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  max-width: 680px;
  margin-bottom: 28px;

  &__eyebrow {
    margin: 0 0 8px;
    color: #2b6cb0;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.8rem;
  }

  h1 {
    margin: 0;
    font-size: clamp(2rem, 5vw, 4rem);
    line-height: 1;
  }

  &__description {
    margin: 18px 0 0;
    color: #667085;
    font-size: 1.125rem;
  }
}

.results {
  margin-top: 28px;

  &__list {
    display: grid;
    gap: 16px;
  }
}
</style>