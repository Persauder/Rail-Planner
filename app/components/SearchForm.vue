<script setup lang="ts">
type SearchFormData = {
  from: string
  to: string
  date: string
  departureAfter: string
  arriveBefore: string
}

const props = withDefaults(defineProps<{
  initialValues?: Partial<SearchFormData>
}>(), {
  initialValues: () => ({}),
})

const emit = defineEmits<{
  search: [payload: SearchFormData]
}>()

const form = reactive<SearchFormData>({
  from: props.initialValues.from || "",
  to: props.initialValues.to || "",
  date: props.initialValues.date || "",
  departureAfter: props.initialValues.departureAfter || "",
  arriveBefore: props.initialValues.arriveBefore || "",
})

const isComplete = computed(() =>
  Boolean(
    form.from.trim()
    && form.to.trim()
    && form.from.trim() !== form.to.trim()
    && form.date
  ),
)

watch(() => form.date, (date) => {
  if (!date) return

  const now = new Date()
  const localDate = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-")
  const localTime = [
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
  ].join(":")

  if (date === localDate) {
    if (form.departureAfter && form.departureAfter < localTime) {
      form.departureAfter = ""
    }
    if (form.arriveBefore && form.arriveBefore < localTime) {
      form.arriveBefore = ""
    }
  }
})

watch(() => props.initialValues, (values) => {
  form.from = values.from || ""
  form.to = values.to || ""
  form.date = values.date || ""
  form.departureAfter = values.departureAfter || ""
  form.arriveBefore = values.arriveBefore || ""
}, { deep: true })

const swapStations = () => {
  const currentFrom = form.from
  form.from = form.to
  form.to = currentFrom
}

const handleSubmit = () => {
  if (!isComplete.value) return

  emit("search", {
    from: form.from.trim(),
    to: form.to.trim(),
    date: form.date,
    departureAfter: form.departureAfter,
    arriveBefore: form.arriveBefore,
  })
}
</script>

<template>
  <form class="search-form" @submit.prevent="handleSubmit">
    <StationPicker
        id="from"
        v-model="form.from"
        class="search-form__station"
        label="Leaving from"
        placeholder="Select station"
    />

    <button
        class="search-form__swap"
        type="button"
        aria-label="Swap departure and destination"
        @click="swapStations"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 7h11m0 0-3-3m3 3-3 3M17 17H6m0 0 3 3m-3-3 3-3" />
      </svg>
    </button>

    <StationPicker
        id="to"
        v-model="form.to"
        class="search-form__station"
        label="Going to"
        placeholder="Select station"
        destination
    />

    <DatePicker v-model="form.date" class="search-form__field--date" />
    <TimePicker
        id="departure-after"
        v-model="form.departureAfter"
        :date="form.date"
        class="search-form__field--departure"
        label="Departure after"
    />
    <TimePicker
        id="arrive-before"
        v-model="form.arriveBefore"
        :date="form.date"
        class="search-form__field--arrival"
        label="Arrive before"
        quick-label="Current time"
    />

    <button class="search-form__submit" type="submit" :disabled="!isComplete">
      <span>Find trains</span>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12h14m-5-5 5 5-5 5" />
      </svg>
    </button>

  </form>
</template>

<style scoped lang="scss">
.search-form {
  display: grid;
  grid-template-columns:
    minmax(180px, 1fr)
    44px
    minmax(180px, 1fr)
    minmax(145px, 0.65fr)
    minmax(112px, 0.5fr)
    minmax(112px, 0.5fr)
    auto;
  gap: 12px;
  align-items: end;
  padding: 14px;
  background: var(--paper);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 22px;
  box-shadow: 0 24px 70px rgba(19, 39, 33, 0.18);

  &__field {
    display: grid;
    gap: 7px;
  }

  label {
    padding-left: 4px;
    color: var(--muted);
    font-size: 0.72rem;
    font-weight: 750;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  &__input-wrap {
    min-height: 58px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 16px;
    border: 1px solid var(--line);
    border-radius: 14px;
    background: #fbfaf6;
    transition: border-color 160ms ease, box-shadow 160ms ease;

    &:focus-within {
      border-color: var(--green);
      box-shadow: 0 0 0 4px rgba(30, 92, 69, 0.1);
    }

    svg {
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
    font-size: 1rem;
    font-weight: 700;
  }

  &__swap {
    width: 42px;
    height: 42px;
    margin-bottom: 8px;
    display: grid;
    place-items: center;
    border: 1px solid var(--line);
    border-radius: 50%;
    background: var(--paper);
    color: var(--green);
    cursor: pointer;
    transition: transform 160ms ease, background 160ms ease;

    &:hover {
      transform: rotate(180deg);
      background: var(--soft-green);
    }

    svg {
      width: 19px;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }

  &__submit {
    min-height: 58px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
    padding: 0 22px;
    border: 0;
    border-radius: 14px;
    background: var(--lime);
    color: var(--ink);
    font-weight: 800;
    cursor: pointer;
    transition: transform 160ms ease, background 160ms ease;
    margin-left: 10px;

    &:disabled {
      background: #e1e3da;
      color: #9ca29e;
      cursor: not-allowed;
    }

    &:hover {
      transform: translateY(-2px);
      background: #d7f067;
    }

    &:hover:disabled {
      transform: none;
      background: #e1e3da;
    }

    svg {
      width: 19px;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }
}

@media (max-width: 1150px) {
  .search-form {
    grid-template-columns: 1fr 44px 1fr;

    &__field--date {
      grid-column: 1 / 2;
    }

    &__field--departure {
      grid-column: 3 / 4;
    }

    &__field--arrival {
      grid-column: 1 / 2;
    }

    &__submit {
      grid-column: 3 / 4;
    }
  }
}

@media (max-width: 580px) {
  .search-form {
    grid-template-columns: 1fr;
    padding: 12px;

    &__swap {
      position: absolute;
      right: 28px;
      z-index: 1;
      margin-top: 78px;
      margin-bottom: 0;
      box-shadow: 0 3px 10px rgba(19, 39, 33, 0.12);
    }

    &__submit {
      grid-column: auto;
      margin-left: 0;
    }

    &__field--date {
      grid-column: auto;
    }

    &__field--departure,
    &__field--arrival {
      grid-column: auto;
    }
  }
}
</style>
