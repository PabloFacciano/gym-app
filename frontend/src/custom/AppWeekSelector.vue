<template>
  <AppCard class="flex flex-col select-none">
    <!-- Week Selector -->
    <div class="flex items-center justify-between">
      <AppButton size="sm" :disabled="false" type="primary" @click="showPreviousDate"
        >&lt;</AppButton
      >
      <div>{{ modelValue.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }) }}</div>
      <AppButton size="sm" :disabled="false" type="primary" @click="showNextDate">&gt;</AppButton>
    </div>
    <!-- Days -->
    <div class="grid grid-cols-7 items-center text-center">
      <div
        v-for="(d, i) in weekDates"
        :key="i"
        class="rounded"
        :class="{
          'cursor-not-allowed text-neutral-500': isAfterToday(d),
          'cursor-pointer': !isAfterToday(d),
          'font-bold': isToday(d),
          'bg-neutral-600': isToday(d) && !isSelected(d),
        }"
        @click="selectDate(d)"
      >
        <div
          class="rounded p-2"
          :class="{
            'bg-app': isSelected(d),
          }"
        >
          <div>{{ d.toLocaleDateString('es-AR', { weekday: 'narrow' }) }}</div>
          <div>{{ d.getDate() }}</div>
        </div>
      </div>
    </div>
    <div class="flex justify-end space-x-3 px-3">
      <div v-if="!isToday(modelValue)" class="flex items-center space-x-3">
        <div class="border-app bg-app h-4 w-8 rounded border"></div>
        <div>Seleccionado</div>
      </div>
      <div
        class="flex cursor-pointer items-center space-x-3 rounded"
        @click="selectDate(new Date())"
      >
        <div
          class="border-app h-4 w-8 rounded border"
          :class="{
            'bg-app': isToday(modelValue),
            'bg-neutral-600': !isToday(modelValue),
          }"
        ></div>
        <div>Hoy</div>
      </div>
    </div>
  </AppCard>
</template>

<script lang="ts">
import AppCard from '@/custom/AppCard.vue'
import AppButton from '@/components/AppButton.vue'
import { defineComponent } from 'vue'

interface State {}

export default defineComponent({
  name: 'AppWeekSelector',
  emits: ['update:modelValue', 'date-selected'],
  props: {
    modelValue: {
      type: Date,
      default: new Date(),
    },
  },
  data(): State {
    return {}
  },
  components: {
    AppButton,
    AppCard,
  },
  watch: {},
  computed: {
    weekDates() {
      return this.getCurrentWeekDaysSun(this.modelValue)
    },
  },
  methods: {
    isAfterToday(dt: Date) {
      const nextDate = new Date(dt)
      const today = new Date()
      return nextDate.getTime() > today.getTime()
    },
    selectDate(dt: Date) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      let nextDate = new Date(dt)
      if (this.isAfterToday(nextDate)) {
        nextDate = today
      }

      if (this.isSameDate(nextDate, this.modelValue)) return

      this.$emit('update:modelValue', nextDate)
      this.$emit('date-selected')
    },
    showPreviousDate() {
      let nextDate = new Date(this.modelValue)
      nextDate.setDate(nextDate.getDate() - 7)
      this.selectDate(nextDate)
    },
    showNextDate() {
      const current = new Date(this.modelValue)
      const nextDate = new Date(current)
      nextDate.setDate(current.getDate() + 7)

      // Get the end of the current week (Sunday at 23:59:59)
      const today = new Date()
      const endOfCurrentWeek = new Date(today)
      const distanceToSunday = 6 - (today.getDay() === 0 ? 6 : today.getDay())
      endOfCurrentWeek.setDate(today.getDate() + distanceToSunday)
      endOfCurrentWeek.setHours(23, 59, 59, 999)

      // Don't allow advancing past the current week
      if (nextDate.getTime() > endOfCurrentWeek.getTime()) return

      this.selectDate(nextDate)
    },
    getCurrentWeekDaysSun(current: Date) {
      // Clone current date FIRST so we don't mutate the prop reference
      const temp = new Date(current)
      const sunday = new Date(temp.setDate(temp.getDate() - temp.getDay()))

      // Fill an array with all 7 days
      return Array.from({ length: 7 }, (_, index) => {
        const day = new Date(sunday)
        day.setDate(sunday.getDate() + index)
        return day
      })
    },
    isToday(dt: Date) {
      const now = new Date()
      return this.isSameDate(dt, now)
    },
    isSelected(dt: Date) {
      return this.isSameDate(dt, this.modelValue)
    },
    isSameDate(dt1: Date, dt2: Date) {
      return (
        dt1 &&
        dt2 &&
        dt1.getFullYear() === dt2.getFullYear() &&
        dt1.getMonth() === dt2.getMonth() &&
        dt1.getDate() === dt2.getDate()
      )
    },
  },
  mounted() {
    //
  },
})
</script>
