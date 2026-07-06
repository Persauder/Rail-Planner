<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const root = ref<HTMLElement>()
const isOpen = ref(false)
const today = new Date()
today.setHours(0, 0, 0, 0)
const visibleMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const toDateValue = (date: Date) => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, "0"),
  String(date.getDate()).padStart(2, "0"),
].join("-")

const fromDateValue = (value: string) => {
  const [year, month, day] = value.split("-").map(Number)
  return year && month && day ? new Date(year, month - 1, day) : null
}

const monthLabel = computed(() =>
  new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(visibleMonth.value),
)

const selectedLabel = computed(() => {
  const date = fromDateValue(props.modelValue)
  if (!date) return ""
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date)
})

const calendarDays = computed(() => {
  const year = visibleMonth.value.getFullYear()
  const month = visibleMonth.value.getMonth()
  const firstWeekDay = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: Array<Date | null> = Array(firstWeekDay).fill(null)

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(year, month, day))
  }

  return days
})

const changeMonth = (offset: number) => {
  visibleMonth.value = new Date(
    visibleMonth.value.getFullYear(),
    visibleMonth.value.getMonth() + offset,
    1,
  )
}

const isPast = (date: Date) => date < today
const isToday = (date: Date) => toDateValue(date) === toDateValue(today)
const isSelected = (date: Date) => toDateValue(date) === props.modelValue

const selectDate = (date: Date) => {
  if (isPast(date)) return
  emit("update:modelValue", toDateValue(date))
  isOpen.value = false
}

const open = () => {
  const selected = fromDateValue(props.modelValue)
  const base = selected || today
  visibleMonth.value = new Date(base.getFullYear(), base.getMonth(), 1)
  isOpen.value = !isOpen.value
}

const handleDocumentClick = (event: MouseEvent) => {
  if (!root.value?.contains(event.target as Node)) isOpen.value = false
}

onMounted(() => document.addEventListener("click", handleDocumentClick))
onBeforeUnmount(() => document.removeEventListener("click", handleDocumentClick))
</script>

<template>
  <div ref="root" class="date-picker">
    <label id="travel-date-label">Travel date</label>
    <button
        type="button"
        class="date-picker__control"
        :class="{ 'date-picker__control--open': isOpen }"
        aria-labelledby="travel-date-label"
        :aria-expanded="isOpen"
        @click="open"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />
      </svg>
      <span :class="{ 'date-picker__placeholder': !selectedLabel }">
        {{ selectedLabel || "Select date" }}
      </span>
      <svg class="date-picker__chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="m6 8 4 4 4-4" />
      </svg>
    </button>

    <div v-if="isOpen" class="date-picker__panel">
      <div class="date-picker__header">
        <button type="button" aria-label="Previous month" @click="changeMonth(-1)">
          <svg viewBox="0 0 20 20" fill="none"><path d="m12 5-5 5 5 5" /></svg>
        </button>
        <strong>{{ monthLabel }}</strong>
        <button type="button" aria-label="Next month" @click="changeMonth(1)">
          <svg viewBox="0 0 20 20" fill="none"><path d="m8 5 5 5-5 5" /></svg>
        </button>
      </div>

      <div class="date-picker__weekdays">
        <span v-for="day in weekDays" :key="day">{{ day }}</span>
      </div>
      <div class="date-picker__days">
        <span v-for="(date, index) in calendarDays" :key="date?.toISOString() || `blank-${index}`">
          <button
              v-if="date"
              type="button"
              :disabled="isPast(date)"
              :class="{
                'date-picker__day--today': isToday(date),
                'date-picker__day--selected': isSelected(date),
              }"
              @click="selectDate(date)"
          >
            {{ date.getDate() }}
          </button>
        </span>
      </div>

      <div class="date-picker__footer">
        <span>Dates use your local timezone</span>
        <button type="button" @click="selectDate(today)">Today</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.date-picker {
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
    gap: 10px;
    padding: 0 13px 0 15px;
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
      min-width: 0;
      flex: 1;
      overflow: hidden;
      font-size: 0.9rem;
      font-weight: 750;
      text-overflow: ellipsis;
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
    z-index: 21;
    top: calc(100% + 9px);
    right: 0;
    width: 330px;
    padding: 16px;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: var(--paper);
    box-shadow: 0 24px 60px rgba(19, 39, 33, 0.2);
  }

  &__header {
    display: grid;
    grid-template-columns: 36px 1fr 36px;
    align-items: center;
    margin-bottom: 16px;

    strong {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 1.05rem;
      font-weight: 600;
      text-align: center;
      text-transform: capitalize;
    }

    button {
      width: 34px;
      height: 34px;
      display: grid;
      place-items: center;
      border: 1px solid var(--line);
      border-radius: 50%;
      background: transparent;
      color: var(--green);
      cursor: pointer;

      &:hover {
        background: var(--soft-green);
      }
    }

    svg {
      width: 18px;
      stroke: currentColor;
      stroke-width: 1.8;
    }
  }

  &__weekdays,
  &__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }

  &__weekdays {
    margin-bottom: 6px;
    color: var(--muted);
    font-size: 0.65rem;
    font-weight: 750;
    text-align: center;
    text-transform: uppercase;
  }

  &__days {
    row-gap: 3px;

    > span {
      min-height: 38px;
      display: grid;
      place-items: center;
    }

    button {
      width: 36px;
      height: 36px;
      border: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--ink);
      cursor: pointer;
      font-size: 0.82rem;
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

  &__day--today {
    box-shadow: inset 0 0 0 1px var(--green);
  }

  &__day--selected {
    background: var(--green) !important;
    color: #fff !important;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--line);

    span {
      color: var(--muted);
      font-size: 0.66rem;
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
    }
  }
}

@media (max-width: 580px) {
  .date-picker__panel {
    right: 0;
    left: 0;
    width: auto;
  }
}
</style>
