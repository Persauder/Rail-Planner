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
      <label for="from">From</label>
      <input
          id="from"
          v-model="form.from"
          type="text"
          autocomplete="off"
          placeholder="Kraków"
      >
    </div>

    <div class="search-form__field">
      <label for="to">To</label>
      <input
          id="to"
          v-model="form.to"
          type="text"
          autocomplete="off"
          placeholder="Warszawa"
      >
    </div>

    <button type="submit">
      Search connections
    </button>
  </form>
</template>

<style scoped lang="scss">
.search-form {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
  align-items: end;
  padding: 24px;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e1e7f0;
  box-shadow: 0 16px 40px rgba(23, 32, 51, 0.08);

  &__field {
    display: grid;
    gap: 8px;
  }

  label {
    font-weight: 700;
  }

  input {
    min-height: 44px;
    padding: 0 14px;
    border: 1px solid #ccd5e0;
    border-radius: 12px;
  }

  input:focus {
    outline: 3px solid rgba(43, 108, 176, 0.25);
    border-color: #2b6cb0;
  }

  button {
    min-height: 44px;
    padding: 0 18px;
    border: 0;
    border-radius: 12px;
    background: #172033;
    color: #ffffff;
    font-weight: 700;
    cursor: pointer;
  }

  button:hover {
    background: #2b6cb0;
  }
}

@media (max-width: 760px) {
  .search-form {
    grid-template-columns: 1fr;
  }
}
</style>