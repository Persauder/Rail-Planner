<script setup lang="ts">
const props = defineProps<{
  id: string
  label: string
  modelValue: string
  date: string
  placeholder?: string
  quickLabel?: string
}>()

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const root = ref<HTMLElement>()
const list = ref<HTMLElement>()
const isOpen = ref(false)
const now = ref(new Date())
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

const slots = Array.from({ length: 48 }, (_, index) => {
  const hours = Math.floor(index / 2)
  const minutes = index % 2 ? 30 : 0
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
})

const localDateValue = (date: Date) => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, "0"),
  String(date.getDate()).padStart(2, "0"),
].join("-")

const currentTime = computed(() =>
  `${String(now.value.getHours()).padStart(2, "0")}:${String(now.value.getMinutes()).padStart(2, "0")}`,
)

const roundedCurrentTime = computed(() => {
  const totalMinutes = now.value.getHours() * 60 + now.value.getMinutes()
  const rounded = Math.min(Math.ceil(totalMinutes / 30) * 30, 23 * 60 + 30)
  return `${String(Math.floor(rounded / 60)).padStart(2, "0")}:${String(rounded % 60).padStart(2, "0")}`
})

const isPast = (time: string) =>
  props.date === localDateValue(now.value) && time < currentTime.value

const selectTime = (time: string) => {
  if (isPast(time)) return
  emit("update:modelValue", time)
  isOpen.value = false
}

const open = async () => {
  now.value = new Date()
  isOpen.value = !isOpen.value
  if (!isOpen.value) return

  await nextTick()
  const target = list.value?.querySelector<HTMLElement>(
    `[data-time="${props.modelValue || roundedCurrentTime.value}"]`,
  )
  target?.scrollIntoView({ block: "center" })
}

const chooseNextDeparture = () => selectTime(roundedCurrentTime.value)
const clearTime = () => {
  emit("update:modelValue", "")
  isOpen.value = false
}

const handleDocumentClick = (event: MouseEvent) => {
  if (!root.value?.contains(event.target as Node)) isOpen.value = false
}

onMounted(() => document.addEventListener("click", handleDocumentClick))
onBeforeUnmount(() => document.removeEventListener("click", handleDocumentClick))
</script>

<template>
  <div ref="root" class="time-picker">
    <label :id="`${id}-label`">{{ label }}</label>
    <button
        type="button"
        class="time-picker__control"
        :class="{ 'time-picker__control--open': isOpen }"
        :aria-labelledby="`${id}-label`"
        :aria-expanded="isOpen"
        @click="open"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7v5l3 2" />
      </svg>
      <span :class="{ 'time-picker__placeholder': !modelValue }">
        {{ modelValue || placeholder || "Select time" }}
      </span>
      <svg class="time-picker__chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="m6 8 4 4 4-4" />
      </svg>
    </button>

    <div v-if="isOpen" class="time-picker__panel">
      <div class="time-picker__header">
        <span>{{ label }}</span>
        <strong>{{ currentTime }}</strong>
        <small>Local time · {{ timeZone }}</small>
      </div>

      <div ref="list" class="time-picker__list">
        <button
            v-for="time in slots"
            :key="time"
            type="button"
            :data-time="time"
            :disabled="isPast(time)"
            :class="{
              'time-picker__option--selected': time === modelValue,
              'time-picker__option--next': time === roundedCurrentTime,
            }"
            @click="selectTime(time)"
        >
          {{ time }}
        </button>
      </div>

      <div class="time-picker__footer">
        <span>30-minute intervals</span>
        <div>
          <button type="button" @click="clearTime">Any time</button>
          <button
              type="button"
              :disabled="isPast(roundedCurrentTime)"
              @click="chooseNextDeparture"
          >
            {{ quickLabel || "From now" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.time-picker {
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
    width: 100%;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 0 12px 0 14px;
    border: 1px solid var(--line);
    border-radius: 14px;
    background: #fbfaf6;
    color: var(--ink);
    cursor: pointer;
    text-align: left;
    transition: border-color 160ms ease, box-shadow 160ms ease;

    &--open {
      border-color: var(--green);
      box-shadow: 0 0 0 4px rgba(30, 92, 69, 0.1);
    }

    > svg:first-child {
      width: 19px;
      flex: 0 0 auto;
      stroke: var(--green);
      stroke-width: 1.7;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    span {
      flex: 1;
      font-size: 0.9rem;
      font-weight: 750;
      white-space: nowrap;
    }
  }

  &__placeholder {
    color: #98a09c;
    font-weight: 600 !important;
  }

  &__chevron {
    width: 18px;
    flex: 0 0 auto;
    stroke: var(--muted);
    stroke-width: 1.7;
  }

  &__panel {
    position: absolute;
    z-index: 22;
    top: calc(100% + 9px);
    right: 0;
    width: 290px;
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: var(--paper);
    box-shadow: 0 24px 60px rgba(19, 39, 33, 0.2);
  }

  &__header {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 3px 12px;
    padding: 15px 16px 13px;
    border-bottom: 1px solid var(--line);

    span {
      color: var(--green);
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    strong {
      grid-row: 1 / 3;
      grid-column: 2;
      align-self: center;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 1.45rem;
      font-weight: 500;
    }

    small {
      color: var(--muted);
      font-size: 0.62rem;
    }
  }

  &__list {
    max-height: 260px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
    overflow-y: auto;
    padding: 10px;

    button {
      min-height: 38px;
      border: 0;
      border-radius: 9px;
      background: transparent;
      color: var(--ink);
      cursor: pointer;
      font-size: 0.78rem;
      font-weight: 700;

      &:hover:not(:disabled) {
        background: var(--soft-green);
      }

      &:disabled {
        color: #c4c9c6;
        cursor: not-allowed;
      }
    }
  }

  &__option--next {
    box-shadow: inset 0 0 0 1px var(--green);
  }

  &__option--selected {
    background: var(--green) !important;
    color: #fff !important;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 14px;
    border-top: 1px solid var(--line);

    span {
      color: var(--muted);
      font-size: 0.66rem;
    }

    > div {
      display: flex;
      gap: 5px;
    }

    button {
      padding: 6px 10px;
      border: 0;
      border-radius: 8px;
      background: var(--soft-green);
      color: var(--green);
      cursor: pointer;
      font-size: 0.72rem;
      font-weight: 800;

      &:first-child {
        background: transparent;
        color: var(--muted);
      }
    }
  }
}

@media (max-width: 580px) {
  .time-picker__panel {
    right: 0;
    left: 0;
    width: auto;
  }
}
</style>
