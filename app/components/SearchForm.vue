<script setup lang="ts">
type SearchFormData = {
  from: string
  to: string
}

const emit = defineEmits<{
  search: [payload: SearchFormData]
}>()

const form = reactive<SearchFormData>({
  from: "Kraków",
  to: "Warszawa",
})

const swapStations = () => {
  const currentFrom = form.from
  form.from = form.to
  form.to = currentFrom
}

const handleSubmit = () => {
  emit("search", {
    from: form.from.trim(),
    to: form.to.trim(),
  })
}
</script>

<template>
  <form class="search-form" @submit.prevent="handleSubmit">
    <div class="search-form__field">
      <label for="from">Leaving from</label>
      <div class="search-form__input-wrap">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
        <input
            id="from"
            v-model="form.from"
            type="text"
            autocomplete="off"
            placeholder="Kraków"
            required
        >
      </div>
    </div>

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

    <div class="search-form__field">
      <label for="to">Going to</label>
      <div class="search-form__input-wrap">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
          <circle cx="12" cy="10" r="2.3" />
        </svg>
        <input
            id="to"
            v-model="form.to"
            type="text"
            autocomplete="off"
            placeholder="Warszawa"
            required
        >
      </div>
    </div>

    <button class="search-form__submit" type="submit">
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
  grid-template-columns: minmax(0, 1fr) 44px minmax(0, 1fr) auto;
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

    &:hover {
      transform: translateY(-2px);
      background: #d7f067;
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

@media (max-width: 820px) {
  .search-form {
    grid-template-columns: 1fr 44px 1fr;

    &__submit {
      grid-column: 1 / -1;
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
    }
  }
}
</style>
