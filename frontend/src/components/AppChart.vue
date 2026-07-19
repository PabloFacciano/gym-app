<template>
  <div class="w-full bg-[#121212] text-zinc-300 p-6 rounded-xl font-sans select-none">
    <!-- Chart Container -->
    <div class="relative flex h-64 w-full">
      
      <!-- Left Y-Axis (Series 0 - Green) -->
      <div class="flex flex-col justify-between pr-3 text-sm font-semibold text-emerald-500 w-6 text-right">
        <span v-for="tick in yTicksLeft" :key="'left-' + tick">{{ tick }}</span>
      </div>

      <!-- Main SVG Canvas Area -->
      <div class="relative flex-1 bg-[#1a1a1a] overflow-visible">
        <svg class="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
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
      <div class="flex flex-col justify-between pl-3 text-sm font-semibold text-sky-500 w-6 text-left">
        <span v-for="tick in yTicksRight" :key="'right-' + tick">{{ tick }}</span>
      </div>
    </div>

    <!-- X-Axis Labels (Formatted Dates) -->
    <div class="flex justify-between pl-9 pr-9 pt-3 text-sm text-zinc-400 font-medium">
      <span v-for="(label, idx) in xLabels" :key="idx" class="w-20 text-center whitespace-nowrap">
        {{ label }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppChart',
  props: {
    data: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  computed: {
    // Standardizes data input, parsing strings safely and sorting them chronologically
    normalizedData() {
      return this.data.map(series => {
        const sortedValues = (series.values || [])
          .map(item => ({
            value: Number(item.value),
            // Parse timestamptz strings or existing Date objects accurately
            dateObj: item.date instanceof Date ? item.date : new Date(item.date)
          }))
          // Ensure coordinates move left-to-right correctly along the X timeline
          .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

        return { ...series, values: sortedValues };
      });
    },

    // Generates 4-step dynamic axis ticks
    yTicksLeft() {
      return this.generateTicks(0);
    },
    yTicksRight() {
      return this.generateTicks(1);
    },

    // Formats and positions your 3 structural timeline anchor labels (Start, Mid, End)
    xLabels() {
      if (this.normalizedData.length === 0 || this.normalizedData[0].values.length === 0) return [];
      const values = this.normalizedData[0].values;
      
      // Select anchors matching your reference layout
      let selectedPoints = [];
      if (values.length <= 3) {
        selectedPoints = values.map(v => v.dateObj);
      } else {
        const mid = Math.floor(values.length / 2);
        selectedPoints = [values[0].dateObj, values[mid].dateObj, values[values.length - 1].dateObj];
      }

      // Format utilizing standard numeric short-hands (e.g. "10-03" / "20-07")
      const formatter = new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: '2-digit'
      });

      // Swapping slash delimiter format with localized dashes matching your layout
      return selectedPoints.map(date => formatter.format(date).replace('/', '-'));
    },

    // Projects timestamps & metrics onto an absolute 0-100 SVG viewBox matrix grid
    scaledPoints() {
      return this.normalizedData.map((series) => {
        const values = series.values;
        if (values.length === 0) return { pointsString: '' };

        const yVals = values.map(v => v.value);
        const yMin = Math.min(...yVals);
        const yMax = Math.max(...yVals);
        const yRange = yMax - yMin === 0 ? 1 : yMax - yMin;

        // X-Axis mapping based on real timestamps instead of simple array indexing
        const tStart = values[0].dateObj.getTime();
        const tEnd = values[values.length - 1].dateObj.getTime();
        const tRange = tEnd - tStart === 0 ? 1 : tEnd - tStart;

        const points = values.map((item) => {
          const x = ((item.dateObj.getTime() - tStart) / tRange) * 100;
          const y = 100 - ((item.value - yMin) / yRange) * 100;
          return `${x},${y}`;
        });

        return {
          pointsString: points.join(' ')
        };
      });
    }
  },
  methods: {
    generateTicks(seriesIndex) {
      if (!this.normalizedData[seriesIndex] || this.normalizedData[seriesIndex].values.length === 0) {
        return [4, 3, 2, 1];
      }
      const vals = this.normalizedData[seriesIndex].values.map(v => v.value);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      
      if (min === max) return [max + 1, max, max - 1, max - 2];
      
      const step = (max - min) / 3;
      return [
        Math.round(max),
        Math.round(max - step),
        Math.round(min + step),
        Math.round(min)
      ];
    }
  }
})
</script>