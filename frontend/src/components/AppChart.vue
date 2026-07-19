<template>
  <div class="w-full rounded-xl p-2 font-sans text-zinc-300 select-none">
    <!-- Chart Container -->
    <div class="relative flex h-64 w-full">
      <!-- Left Y-Axis (Series 0 - Green) -->
      <div
        class="flex w-6 flex-col justify-between pr-3 text-right text-sm font-semibold text-emerald-500"
      >
        <span v-for="tick in yTicksLeft" :key="'left-' + tick">{{ tick }}</span>
      </div>

      <!-- Main SVG Canvas Area -->
      <div class="relative flex-1 overflow-visible rounded-lg bg-neutral-900 p-4">
        <svg
          class="h-full w-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <!-- Render Series Lines -->
          <polyline
            v-for="(series, sIdx) in scaledPoints"
            :key="sIdx"
            fill="none"
            :stroke="sIdx === 0 ? '#10b981' : '#0ea5e9'"
            stroke-width="2"
            vector-effect="non-scaling-stroke"
            stroke-linecap="round"
            stroke-linejoin="round"
            :points="series.pointsString"
          />
        </svg>
      </div>

      <!-- Right Y-Axis (Series 1 - Blue) -->
      <div
        class="flex w-6 flex-col justify-between pl-3 text-left text-sm font-semibold text-sky-500"
      >
        <span v-for="tick in yTicksRight" :key="'right-' + tick">{{ tick }}</span>
      </div>
    </div>

    <!-- X-Axis Labels (Formatted Dates) -->
    <div class="flex justify-between pt-3 pr-9 pl-9 text-sm font-medium text-zinc-400">
      <span v-for="(label, idx) in xLabels" :key="idx" class="w-20 text-center whitespace-nowrap">
        {{ label }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export interface ChartSerie {
  name: string
  values: {
    value: number
    date: Date
  }[]
}

export default defineComponent({
  name: 'AppChart',
  props: {
    data: {
      type: Object as PropType<ChartSerie[]>,
      required: true,
      default: () => [],
    },
  },
  computed: {
    // Standardizes data input, parsing strings safely and sorting them chronologically
    normalizedData() {
      return this.data.map((series) => {
        const sortedValues = (series.values || [])
          .map((item) => ({
            value: Number(item.value),
            // Parse timestamptz strings or existing Date objects accurately
            dateObj: item.date instanceof Date ? item.date : new Date(item.date),
          }))
          // Ensure coordinates move left-to-right correctly along the X timeline
          .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())

        return { ...series, values: sortedValues }
      })
    },

    // Generates 4-step dynamic axis ticks
    yTicksLeft() {
      return this.generateTicks(0)
    },
    yTicksRight() {
      return this.generateTicks(1)
    },

    // Formats and positions your 3 structural timeline anchor labels (Start, Mid, End)
    xLabels() {
      if (this.normalizedData.length === 0 || this.normalizedData[0].values.length === 0) return []
      const values = this.normalizedData[0].values

      // Select anchors matching your reference layout
      let selectedPoints = []
      if (values.length <= 3) {
        selectedPoints = values.map((v) => v.dateObj)
      } else {
        const mid = Math.floor(values.length / 2)
        selectedPoints = [values[0].dateObj, values[mid].dateObj, values[values.length - 1].dateObj]
      }

      // Format utilizing standard numeric short-hands (e.g. "10-03" / "20-07")
      const formatter = new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: 'short',
      })

      // Swapping slash delimiter format with localized dashes matching your layout
      return selectedPoints.map((date) => formatter.format(date).replace('/', '-'))
    },

    // Projects timestamps & metrics onto an absolute 0-100 SVG viewBox matrix grid
    scaledPoints() {
      return this.normalizedData.map((series) => {
        const values = series.values
        if (values.length === 0) return { pointsString: '' }

        const yVals = values.map((v) => v.value)
        const yMin = Math.min(...yVals)
        const yMax = Math.max(...yVals)
        const yRange = yMax - yMin === 0 ? 1 : yMax - yMin

        // X-Axis mapping based on real timestamps instead of simple array indexing
        const tStart = values[0].dateObj.getTime()
        const tEnd = values[values.length - 1].dateObj.getTime()
        const tRange = tEnd - tStart === 0 ? 1 : tEnd - tStart

        const points = values.map((item) => {
          const x = ((item.dateObj.getTime() - tStart) / tRange) * 100
          const y = 100 - ((item.value - yMin) / yRange) * 100
          return `${x},${y}`
        })

        return {
          pointsString: points.join(' '),
        }
      })
    },
  },
  methods: {
    generateTicks(seriesIndex) {
      if (
        !this.normalizedData[seriesIndex] ||
        this.normalizedData[seriesIndex].values.length === 0
      ) {
        return []
      }
      const vals = this.normalizedData[seriesIndex].values.map((v) => v.value)
      const min = Math.min(...vals)
      const max = Math.max(...vals)

      if (min === max) return [max + 1, max, max - 1, max - 2]

      const step = (max - min) / 4
      return [Math.round(max), Math.round(max - step), Math.round(min + step), Math.round(min)]
    },
  },
})
</script>
