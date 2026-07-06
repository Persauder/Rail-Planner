<script setup lang="ts">
import type { Connection } from "~/types/connection"

const { searchConnections } = useConnections()

const connections = ref<Connection[]>([])
const isLoading = ref(false)
const errorMessage = ref("")
const hasSearched = ref(false)
const route = useRoute()
const router = useRouter()
const searchStorageKey = "rail-planner:last-search"

type SearchParams = {
  from: string
  to: string
  date: string
  departureAfter: string
  arriveBefore: string
}

const emptySearch = (): SearchParams => ({
  from: "",
  to: "",
  date: "",
  departureAfter: "",
  arriveBefore: "",
})
const currentRoute = reactive<SearchParams>(emptySearch())
const restoredSearch = reactive<SearchParams>(emptySearch())

const queryValue = (value: unknown) =>
  Array.isArray(value) ? String(value[0] || "") : String(value || "")

const searchFromQuery = (): SearchParams => ({
  from: queryValue(route.query.from),
  to: queryValue(route.query.to),
  date: queryValue(route.query.date),
  departureAfter: queryValue(route.query.departureAfter || route.query.time),
  arriveBefore: queryValue(route.query.arriveBefore),
})

const canSearch = (params: SearchParams) =>
  Boolean(params.from && params.to && params.date && params.from !== params.to)

const formattedSearchDate = computed(() => {
  if (!currentRoute.date) return ""

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Warsaw",
  }).format(new Date(`${currentRoute.date}T12:00:00Z`))
})

const formattedTimeRange = computed(() => {
  if (currentRoute.departureAfter && currentRoute.arriveBefore) {
    return `depart after ${currentRoute.departureAfter}, arrive before ${currentRoute.arriveBefore}`
  }
  if (currentRoute.departureAfter) {
    return `depart after ${currentRoute.departureAfter}`
  }
  if (currentRoute.arriveBefore) {
    return `arrive before ${currentRoute.arriveBefore}`
  }
  return "any departure time"
})

const handleSearch = async (params: SearchParams) => {
  hasSearched.value = true
  isLoading.value = true
  errorMessage.value = ""
  currentRoute.from = params.from
  currentRoute.to = params.to
  currentRoute.date = params.date
  currentRoute.departureAfter = params.departureAfter
  currentRoute.arriveBefore = params.arriveBefore
  Object.assign(restoredSearch, params)

  localStorage.setItem(searchStorageKey, JSON.stringify(params))
  void router.replace({
    query: {
      from: params.from,
      to: params.to,
      date: params.date,
      ...(params.departureAfter
        ? { departureAfter: params.departureAfter }
        : {}),
      ...(params.arriveBefore
        ? { arriveBefore: params.arriveBefore }
        : {}),
    },
  })

  try {
    connections.value = await searchConnections(params)
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage
      || "Something went wrong. Please try again."
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  let savedSearch = searchFromQuery()

  if (!canSearch(savedSearch)) {
    try {
      const storedValue = localStorage.getItem(searchStorageKey)
      if (storedValue) savedSearch = { ...emptySearch(), ...JSON.parse(storedValue) }
    } catch {
      localStorage.removeItem(searchStorageKey)
    }
  }

  Object.assign(restoredSearch, savedSearch)
  if (canSearch(savedSearch)) void handleSearch(savedSearch)
})
</script>

<template>
  <main>
    <section class="hero">
      <div class="hero__glow" aria-hidden="true" />
      <div class="container hero__inner">
        <div class="hero__copy">
          <p class="eyebrow">
            <span />
            Explore Poland by rail
          </p>
          <h1>Your next journey<br><em>starts here.</em></h1>
          <p class="hero__description">
            Search routes, compare fares, and find the train that fits your day.
          </p>
        </div>

        <div class="hero__route" aria-hidden="true">
          <div class="hero__route-top">
            <span>Popular today</span>
            <span>01 / 03</span>
          </div>
          <div class="hero__cities">
            <div>
              <strong>KRK</strong>
              <span>Kraków</span>
            </div>
            <div class="hero__track">
              <span />
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14m-5-5 5 5-5 5" />
              </svg>
              <span />
            </div>
            <div>
              <strong>WAW</strong>
              <span>Warszawa</span>
            </div>
          </div>
          <p>Fastest route <strong>2h 33m</strong></p>
        </div>
      </div>

      <div class="container hero__search">
        <SearchForm :initial-values="restoredSearch" @search="handleSearch" />
        <div class="hero__benefits">
          <span>
            <svg viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" /></svg>
            Clear fare comparison
          </span>
          <span>
            <svg viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" /></svg>
            Direct and connecting trains
          </span>
        </div>
      </div>
    </section>

    <section id="connections" class="results">
      <div class="container">
        <div v-if="hasSearched" class="results__header">
          <div>
            <p class="eyebrow"><span />Available journeys</p>
            <h2>{{ currentRoute.from }} to {{ currentRoute.to }}</h2>
            <p class="results__when">{{ formattedSearchDate }}, {{ formattedTimeRange }}</p>
          </div>
          <p v-if="!isLoading && !errorMessage">
            {{ connections.length }} {{ connections.length === 1 ? "connection" : "connections" }}
          </p>
        </div>

        <div aria-live="polite">
          <div v-if="!hasSearched" class="results__state results__state--idle">
            <strong>Where do you want to go?</strong>
            <p>Choose stations and a date. Time filters are optional.</p>
          </div>

          <div v-else-if="isLoading" class="results__state">
            <span class="results__loader" />
            <p>Checking the tracks…</p>
          </div>

          <div v-else-if="errorMessage" class="results__state">
            <strong>We hit a signal problem.</strong>
            <p>{{ errorMessage }}</p>
          </div>

          <div v-else-if="connections.length === 0" class="results__state">
            <strong>No trains found</strong>
            <p>Try another station or check the spelling.</p>
          </div>

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
  </main>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  padding: 72px 0 0;
  overflow: visible;
  background: var(--ink);
  color: #fff;

  &__glow {
    position: absolute;
    top: -210px;
    right: 2%;
    width: 520px;
    height: 520px;
    border: 1px solid rgba(205, 234, 91, 0.18);
    border-radius: 50%;
    box-shadow:
      0 0 0 80px rgba(205, 234, 91, 0.025),
      0 0 0 160px rgba(205, 234, 91, 0.018);
  }

  &__inner {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.7fr);
    gap: 80px;
    align-items: center;
  }

  &__copy h1 {
    max-width: 720px;
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(3.3rem, 6.3vw, 6.4rem);
    font-weight: 500;
    line-height: 0.92;
    letter-spacing: -0.055em;

    em {
      color: var(--lime);
      font-weight: 500;
    }
  }

  &__description {
    max-width: 510px;
    margin: 26px 0 0;
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.05rem;
    line-height: 1.7;
  }

  &__route {
    padding: 24px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.055);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.16);

    > p {
      display: flex;
      justify-content: space-between;
      margin: 24px 0 0;
      padding-top: 18px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.75rem;

      strong {
        color: var(--lime);
      }
    }
  }

  &__route-top {
    display: flex;
    justify-content: space-between;
    color: rgba(255, 255, 255, 0.45);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  &__cities {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 14px;
    align-items: center;
    margin-top: 26px;

    > div:not(.hero__track) {
      display: grid;

      &:last-child {
        text-align: right;
      }
    }

    strong {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 2rem;
      font-weight: 500;
    }

    span {
      color: rgba(255, 255, 255, 0.48);
      font-size: 0.72rem;
    }
  }

  &__track {
    display: flex;
    align-items: center;

    span {
      width: 6px;
      height: 6px;
      flex: 0 0 auto;
      border: 1px solid var(--lime);
      border-radius: 50%;
    }

    &::before,
    &::after {
      content: "";
      height: 1px;
      flex: 1;
      background: rgba(205, 234, 91, 0.45);
    }

    svg {
      width: 21px;
      margin: 0 5px;
      stroke: var(--lime);
      stroke-width: 1.5;
    }
  }

  &__search {
    position: relative;
    z-index: 2;
    margin-top: 58px;
    transform: translateY(50%);
  }

  &__benefits {
    position: absolute;
    top: calc(100% + 13px);
    left: 4px;
    display: flex;
    gap: 22px;
    color: var(--muted);
    font-size: 0.72rem;

    span {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    svg {
      width: 14px;
      stroke: var(--green);
      stroke-width: 2;
    }
  }
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 20px;
  color: var(--lime);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;

  span {
    width: 24px;
    height: 1px;
    background: currentColor;
  }
}

.results {
  padding: 128px 0 72px;

  &__list {
    display: grid;
    gap: 12px;
  }

  &__header {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 28px;

    .eyebrow {
      margin-bottom: 9px;
      color: var(--green);
    }

    h2 {
      margin: 0;
      font-family: Georgia, "Times New Roman", serif;
      font-size: clamp(2rem, 4vw, 3.1rem);
      font-weight: 500;
      letter-spacing: -0.04em;
    }

    .results__when {
      margin: 8px 0 0;
      color: var(--muted);
      font-size: 0.82rem;
    }

    > p {
      margin: 0 0 5px;
      color: var(--muted);
      font-size: 0.82rem;
    }
  }

  &__state {
    min-height: 220px;
    display: grid;
    place-items: center;
    padding: 32px;
    border: 1px dashed var(--line);
    border-radius: 18px;
    color: var(--muted);
    text-align: center;

    p {
      margin: 6px 0 0;
    }
  }

  &__loader {
    width: 28px;
    height: 28px;
    border: 2px solid var(--line);
    border-top-color: var(--green);
    border-radius: 50%;
    animation: spin 700ms linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 820px) {
  .hero {
    padding-top: 54px;

    &__inner {
      grid-template-columns: 1fr;
      gap: 40px;
    }

    &__route {
      display: none;
    }

    &__search {
      margin-top: 38px;
      transform: translateY(70px);
    }
  }

  .results {
    padding-top: 164px;
  }
}

@media (max-width: 580px) {
  .hero {
    &__copy h1 {
      font-size: clamp(3rem, 15vw, 4.6rem);
    }

    &__description {
      font-size: 0.95rem;
    }

    &__benefits {
      display: none;
    }
  }

  .results__header {
    align-items: start;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
