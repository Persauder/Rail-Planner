<script setup lang="ts">
const props = defineProps<{
  id: string
  label: string
  modelValue: string
  placeholder: string
  destination?: boolean
}>()

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const stations = [
  "Białystok",
  "Bielsko-Biała Główna",
  "Bydgoszcz Główna",
  "Częstochowa",
  "Gdańsk Główny",
  "Gdynia Główna",
  "Gliwice",
  "Katowice",
  "Kielce",
  "Kołobrzeg",
  "Kraków Główny",
  "Lublin Główny",
  "Łódź Fabryczna",
  "Łódź Kaliska",
  "Olsztyn Główny",
  "Opole Główne",
  "Poznań Główny",
  "Rzeszów Główny",
  "Sopot",
  "Szczecin Główny",
  "Toruń Główny",
  "Warszawa Centralna",
  "Warszawa Gdańska",
  "Warszawa Zachodnia",
  "Wrocław Główny",
  "Zakopane",
  "Zielona Góra Główna",
]

const root = ref<HTMLElement>()
const isOpen = ref(false)
const activeIndex = ref(0)

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/ł/gi, "l")
    .toLocaleLowerCase()

const filteredStations = computed(() => {
  const query = normalize(props.modelValue.trim())
  if (!query) return stations
  return stations.filter((station) => normalize(station).includes(query))
})

const updateValue = (value: string) => {
  emit("update:modelValue", value)
  activeIndex.value = 0
  isOpen.value = true
}

const selectStation = (station: string) => {
  emit("update:modelValue", station)
  isOpen.value = false
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    isOpen.value = false
    return
  }

  if (!isOpen.value && (event.key === "ArrowDown" || event.key === "Enter")) {
    isOpen.value = true
    return
  }

  if (event.key === "ArrowDown") {
    event.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, filteredStations.value.length - 1)
  } else if (event.key === "ArrowUp") {
    event.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (event.key === "Enter" && filteredStations.value[activeIndex.value]) {
    event.preventDefault()
    selectStation(filteredStations.value[activeIndex.value])
  }
}

const handleDocumentClick = (event: MouseEvent) => {
  if (!root.value?.contains(event.target as Node)) isOpen.value = false
}

onMounted(() => document.addEventListener("click", handleDocumentClick))
onBeforeUnmount(() => document.removeEventListener("click", handleDocumentClick))
</script>

<template>
  <div ref="root" class="station-picker">
    <label :for="id">{{ label }}</label>
    <div class="station-picker__control" :class="{ 'station-picker__control--open': isOpen }">
      <svg v-if="!destination" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2.3" />
      </svg>
      <input
          :id="id"
          :value="modelValue"
          type="text"
          autocomplete="off"
          :placeholder="placeholder"
          role="combobox"
          :aria-expanded="isOpen"
          :aria-controls="`${id}-options`"
          @input="updateValue(($event.target as HTMLInputElement).value)"
          @focus="isOpen = true"
          @keydown="handleKeydown"
      >
      <button
          v-if="modelValue"
          type="button"
          class="station-picker__clear"
          :aria-label="`Clear ${label.toLowerCase()}`"
          @click="updateValue('')"
      >
        ×
      </button>
      <svg v-else class="station-picker__chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="m6 8 4 4 4-4" />
      </svg>
    </div>

    <div v-if="isOpen" :id="`${id}-options`" class="station-picker__panel" role="listbox">
      <div class="station-picker__panel-title">
        <span>Polish stations</span>
        <small>{{ filteredStations.length }} results</small>
      </div>
      <button
          v-for="(station, index) in filteredStations"
          :key="station"
          type="button"
          class="station-picker__option"
          :class="{ 'station-picker__option--active': index === activeIndex }"
          role="option"
          :aria-selected="station === modelValue"
          @mouseenter="activeIndex = index"
          @click="selectStation(station)"
      >
        <span class="station-picker__pin" />
        <span>
          <strong>{{ station }}</strong>
          <small>Railway station</small>
        </span>
      </button>
      <p v-if="filteredStations.length === 0" class="station-picker__empty">
        Type the full station name to search.
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.station-picker {
  position: relative;
  display: grid;
  gap: 7px;
  min-width: 0;

  > label {
    padding-left: 4px;
    color: var(--muted);
    font-size: 0.72rem;
    font-weight: 750;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  &__control {
    min-height: 58px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 14px 0 16px;
    border: 1px solid var(--line);
    border-radius: 14px;
    background: #fbfaf6;
    transition: border-color 160ms ease, box-shadow 160ms ease;

    &--open {
      border-color: var(--green);
      box-shadow: 0 0 0 4px rgba(30, 92, 69, 0.1);
    }

    > svg {
      width: 20px;
      flex: 0 0 auto;
      stroke: var(--green);
      stroke-width: 1.8;
    }
  }

  input {
    width: 100%;
    min-width: 0;
    padding: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--ink);
    font-size: 0.96rem;
    font-weight: 700;

    &::placeholder {
      color: #98a09c;
      font-weight: 600;
    }
  }

  &__clear {
    width: 26px;
    height: 26px;
    flex: 0 0 auto;
    border: 0;
    border-radius: 50%;
    background: var(--soft-green);
    color: var(--green);
    cursor: pointer;
    font-size: 1.1rem;
    line-height: 1;
  }

  &__chevron {
    width: 18px !important;
    stroke: var(--muted) !important;
  }

  &__panel {
    position: absolute;
    z-index: 20;
    top: calc(100% + 9px);
    left: 0;
    width: max(100%, 300px);
    max-height: 330px;
    overflow-y: auto;
    padding: 8px;
    border: 1px solid var(--line);
    border-radius: 16px;
    background: var(--paper);
    box-shadow: 0 24px 60px rgba(19, 39, 33, 0.2);
  }

  &__panel-title {
    display: flex;
    justify-content: space-between;
    padding: 8px 10px 10px;
    color: var(--green);
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;

    small {
      color: var(--muted);
      font-weight: 600;
      letter-spacing: 0;
      text-transform: none;
    }
  }

  &__option {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    border: 0;
    border-radius: 11px;
    background: transparent;
    color: var(--ink);
    cursor: pointer;
    text-align: left;

    &--active,
    &:hover {
      background: var(--soft-green);
    }

    > span:last-child {
      display: grid;
      gap: 2px;
    }

    strong {
      font-size: 0.88rem;
    }

    small {
      color: var(--muted);
      font-size: 0.69rem;
    }
  }

  &__pin {
    width: 10px;
    height: 10px;
    flex: 0 0 auto;
    border: 2px solid var(--green);
    border-radius: 50%;
    box-shadow: 0 0 0 4px rgba(30, 92, 69, 0.08);
  }

  &__empty {
    margin: 0;
    padding: 18px 10px;
    color: var(--muted);
    font-size: 0.82rem;
    text-align: center;
  }
}

@media (max-width: 580px) {
  .station-picker__panel {
    width: 100%;
  }
}
</style>
