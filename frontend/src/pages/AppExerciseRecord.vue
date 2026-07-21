<template>
  <div>
    <AppNavbar />

    <!-- Loader -->
    <AppCenter v-if="loading">
      <AppLoader />
    </AppCenter>

    <!-- Record -->
    <div v-if="exercise && !loading && manager">
      <!-- Header -->
      <div v-if="exercise && !loading" class="space-y-6 rounded bg-neutral-700">
        <AppCenter>
          <!-- Return link -->
          <RouterLink :to="{ name: 'exercises' }" class="text-app-lighter hover:underline"
            >&lt; Ir a Ejercicios</RouterLink
          >
          <!-- Title -->
          <div class="flex items-center justify-between space-x-3">
            <div class="grow">
              <div
                v-if="mode == 'view'"
                @click="edit"
                class="line-clamp-3 grow cursor-pointer text-xl font-medium break-all"
                v-text="exercise.name"
              ></div>
              <AppTextInput
                v-if="mode == 'edit'"
                v-model="exercise.name"
                type="text"
                placeholder="Nombre"
                :maxlength="50"
                :required="true"
              />
            </div>
            <div class="flex space-x-3">
              <AppButton type="primary" size="sm" v-if="mode == 'view'" @click="edit"
                >Editar</AppButton
              >
              <AppButton
                type="danger"
                size="sm"
                v-if="mode == 'view'"
                @click="showDeleteModal = true"
                >Eliminar</AppButton
              >
              <AppButton
                type="primary"
                size="sm"
                v-if="mode == 'edit'"
                @click="save"
                :disabled="!canSave"
                :title="cantSaveReasons.join('\n')"
                >Guardar</AppButton
              >
              <AppButton type="secondary" size="sm" v-if="mode == 'edit'" @click="cancel"
                >Cancelar</AppButton
              >
            </div>
          </div>
          <!-- Table -->
          <div v-if="hasMetrics" class="overflow-x-auto rounded-lg border border-neutral-500">
            <table class="min-w-full">
              <thead class="divide-y divide-neutral-500 bg-neutral-600" v-if="mode == 'edit'">
                <tr class="">
                  <th class="px-4 py-3 text-start text-sm whitespace-nowrap">Métrica</th>
                  <th class="px-4 py-3 text-start text-sm whitespace-nowrap">Valor</th>
                  <th class="px-4 py-3 text-start text-sm whitespace-nowrap">Medida</th>
                  <th
                    class="px-4 py-3 text-start text-sm whitespace-nowrap"
                    v-if="mode == 'edit'"
                  ></th>
                </tr>
              </thead>
              <tbody class="" :class="{ 'divide-y divide-neutral-500': mode == 'view' }">
                <tr v-for="(metric, index) in exercise.metrics" :key="index">
                  <td class="items-start text-sm font-medium whitespace-nowrap">
                    <div v-if="mode == 'view'" class="px-4 py-3" v-text="metric.name"></div>
                    <AppTextInput
                      v-if="mode == 'edit'"
                      v-model="metric.name"
                      type="text"
                      placeholder="Nombre"
                      :maxlength="50"
                      :required="true"
                    />
                  </td>
                  <td class="items-start text-sm font-medium whitespace-nowrap">
                    <div v-if="mode == 'view'" class="px-4 py-3" v-text="metric.defaultValue"></div>
                    <AppTextInput
                      v-if="mode == 'edit'"
                      v-model="metric.defaultValue"
                      type="number"
                      placeholder="Valor"
                      :maxlength="50"
                      :required="false"
                      :minimun="0"
                      :maximun="1000000000"
                    />
                  </td>
                  <td class="items-start text-sm font-medium whitespace-nowrap">
                    <div v-if="mode == 'view'" class="px-4 py-3" v-text="metric.measure"></div>
                    <AppTextInput
                      v-if="mode == 'edit'"
                      v-model="metric.measure"
                      type="text"
                      placeholder="Medida"
                      :maxlength="50"
                      :required="false"
                    />
                  </td>
                  <td
                    class="items-start px-2 text-sm font-medium whitespace-nowrap"
                    v-if="mode == 'edit'"
                  >
                    <AppButton
                      size="sm"
                      type="danger"
                      @click="manager.deleteMetric(exercise, index)"
                      >&times;</AppButton
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex justify-start pb-6" v-if="mode == 'edit'">
            <AppButton
              type="secondary"
              size="sm"
              @click="manager.addMetric(exercise)"
              :disabled="hasEmptyMetric"
              >Agregar Métrica</AppButton
            >
          </div>
          <!-- Tabs -->
          <div class="-mb-6 flex flex-wrap sm:-mb-8" v-if="mode == 'view'">
            <div
              class="border-app cursor-pointer px-6 py-3"
              :class="{ 'border-b-4': tab == 'stats' }"
              @click="tab = 'stats'"
            >
              Estadísticas
            </div>
            <div
              class="border-app cursor-pointer px-6 py-3"
              :class="{ 'border-b-4': tab == 'history' }"
              @click="tab = 'history'"
            >
              Historial
            </div>
          </div>
        </AppCenter>
      </div>
      <!-- Content  -->
      <AppCenter v-if="mode == 'view'">
        <!-- Stats -->
        <div v-if="tab == 'stats'" class="space-y-4">
          <div v-if="!hasMetrics">
            <div class="text-center">
              Para ver estadísticas, agrega una <span class="font-medium">Métrica</span> a este
              ejercicio.
            </div>
          </div>
          <div v-if="hasMetrics" class="space-y-4">
            <div class="font-medium">Periodo</div>
            <AppDropdown v-model="stats.period" :list="stats.list" :required="true" />

            <apexchart
              class="rounded-lg border border-neutral-600 bg-neutral-900 p-3"
              type="bar"
              :options="chartOptionsForGraph"
              :series="chartDataForGraph"
            ></apexchart>

            <!-- Labels -->
            <div class="space-y-3 py-4" v-if="false">
              <div
                v-for="(serie, i) in chartSeries"
                :key="i"
                class="flex items-center space-x-4 rounded bg-neutral-900 p-3"
              >
                <div
                  class="h-4 w-4 rounded-full"
                  :style="{
                    'background-color': serie.color,
                  }"
                ></div>
                <div>{{ serie.name }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- History -->
        <div v-if="tab == 'history'" class="space-y-4">
          <AppExerciseBuilder
            v-for="instance in instances"
            :key="instance.id"
            :exercise="exercise"
            :exercise-instance="instance"
            :enabled="false"
          />
        </div>
      </AppCenter>
    </div>
    <!-- Delete Modal -->
    <AppModal
      v-model:isOpen="showDeleteModal"
      :title="`Eliminar [${exercise?.name ?? '<sin nombre>'}] ?`"
      primaryButtonText="Eliminar"
      secondaryButtonText="Cancelar"
      @primaryButtonClicked="deleteRow"
      @secondaryButtonClicked="showDeleteModal = false"
    >
      Esta acción no se puede deshacer.
    </AppModal>
  </div>
</template>

<script lang="ts">
import AppTextInput from '@/components/AppTextInput.vue'
import AppButton from '@/components/AppButton.vue'
import AppNavbar from '@/custom/AppNavbar.vue'
import AppDropdown from '@/components/AppDropdown.vue'
import AppModal from '@/components/AppModal.vue'
import AppLoader from '@/components/AppLoader.vue'
import AppCenter from '@/custom/AppCenter.vue'
import type { SelectOption } from '@/components/AppDropdown.vue'

import { defineComponent } from 'vue'

import { ExerciseManager, type AppExerciseDefinition } from '@/backend/Exercise'
import { mapState } from 'pinia'
import { AuthStore } from '@/stores/auth'
import AppExerciseBuilder from '@/custom/AppExerciseBuilder.vue'
import { ExerciseInstanceManager, type AppExerciseInstance } from '@/backend/ExerciseInstance'
import { deepCopy, getRandomVibrantColor } from '@/utils/utils'

interface State {
  exercise: AppExerciseDefinition | null
  instances: AppExerciseInstance[]
  loading: boolean
  mode: 'view' | 'edit'
  tab: 'stats' | 'history'
  stats: {
    period: string
    list: SelectOption[]
  }
  showDeleteModal: boolean
}

export interface ChartSerie {
  color: string
  name: string
  values: {
    value: Number
    date: Date
  }[]
}
export interface GraphSerie {
  name: string
  data: (number | null)[]
}

export default defineComponent({
  name: 'AppExcerciseRecord',
  props: {
    exerciseId: String,
  },
  data(): State {
    return {
      exercise: null,
      instances: [],
      loading: false,
      showDeleteModal: false,
      mode: 'view',
      tab: 'stats',
      stats: {
        period: 'alltime',
        list: [
          {
            label: 'Todo el tiempo',
            description: '',
            value: 'alltime',
          },
        ],
      },
    }
  },
  components: {
    AppNavbar,
    AppButton,
    AppTextInput,
    AppDropdown,
    AppModal,
    AppLoader,
    AppCenter,
    AppExerciseBuilder,
  },
  watch: {
    exerciseId: {
      async handler() {
        await this.loadRecord()
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState(AuthStore, ['user']),
    chartOptionsForGraph() {
      const xCategories: string[] = this.chartXAxisDates.map((dt: Date) => {
        return dt.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
      })

      return {
        chart: {
          type: 'bar',
          background: 'transparent',
        },
        theme: {
          mode: 'dark',
          palette: 'palette10',
          monochrome: {
            enabled: true,
            color: '#007acc',
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 5,
            borderRadiusApplication: 'end',
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent'],
        },
        xaxis: {
          categories: xCategories,
        },
        fill: {
          opacity: 1,
        },
      }
    },
    chartXAxisDates(): Date[] {
      const timestamps = this.groupedSeriesData.flatMap((serie) =>
        serie.values.map((val) => val.date.getTime()),
      )

      return Array.from(new Set(timestamps)).map((time) => new Date(time))
    },
    chartSeries(): ChartSerie[] {
      const metrics = this.exercise?.metrics ?? []

      return metrics.map((metric) => ({
        color: getRandomVibrantColor(),
        name: metric.measure ? `${metric.name} ${metric.measure}` : metric.name,
        values: [],
      })) as ChartSerie[]
    },

    groupedSeriesData(): ChartSerie[] {
      const TODAY = new Date()
      const series: ChartSerie[] = []

      // Step 1: Filter instances to keep only the FIRST instance per calendar date
      const seenDates = new Set<string>()
      const uniqueInstancesByDate: Array<{ dateKey: string; dateObj: Date; instance: any }> = []

      for (const instance of this.instances) {
        const rawDate = instance.createdDate ? new Date(instance.createdDate) : TODAY

        // Standardize to YYYY-MM-DD key for grouping
        const dateKey = rawDate.toISOString().split('T')[0] ?? ''

        if (!seenDates.has(dateKey)) {
          seenDates.add(dateKey)

          // Create a normalized Date object representing midnight UTC (no time part)
          const dateWithoutTime = new Date(`${dateKey}T00:00:00.000Z`)

          uniqueInstancesByDate.push({
            dateKey,
            dateObj: dateWithoutTime,
            instance,
          })
        }
      }

      // Step 2: Build the series data using only the unique daily instances
      for (let i = 0; i < this.chartSeries.length; i++) {
        if (i >= 9) {
          console.warn('Exceeded metric count supported. count=' + this.chartSeries.length)
          break
        }

        const serie = deepCopy(this.chartSeries[i])
        if (!serie) continue

        // Standardize metric key e.g., 'metric01', 'metric02'
        const metricKey = `metric0${i + 1}`

        uniqueInstancesByDate.forEach(({ dateObj, instance }) => {
          const rawValue = instance[metricKey]
          const value: number | null = typeof rawValue === 'number' ? rawValue : null

          serie.values.push({
            value,
            date: dateObj, // Date object with time set to 00:00:00
          })
        })

        series.push(serie)
      }

      return series
    },

    chartDataForGraph() {
      // Reads directly from this.groupedSeriesData
      return this.groupedSeriesData.map((serie) => ({
        name: serie.name,
        data: serie.values.map((v) => v.value),
      }))
    },
    hasEmptyMetric() {
      if (!this.exercise) return false
      return this.manager.hasEmptyMetric(this.exercise)
    },
    hasMetrics() {
      if (!this.exercise) return false
      return this.manager.hasMetrics(this.exercise)
    },
    cantSaveReasons() {
      if (!this.exercise) return ['Exercise not initialized']
      return this.manager?.cantSaveReasons(this.exercise) ?? []
    },
    canSave() {
      if (!this.exercise) return false
      return this.manager.canSave(this.exercise)
    },
    instanceManager() {
      return ExerciseInstanceManager.getInstance()
    },
    manager() {
      return ExerciseManager.getInstance()
    },
  },
  methods: {
    async loadRecord() {
      if (!this.manager) return
      // search and clone exercise
      this.loading = true

      if (this.exerciseId == 'new') {
        this.exercise = this.manager.newRow()
        this.instances = []
        this.mode = 'edit'
      } else {
        try {
          this.exercise = await this.manager.getById(this.exerciseId ?? '')

          const rows = await this.instanceManager.getRows()
          rows.sort((a, b) => {
            // If both are null, treat them as equal
            if (a.createdDate === null && b.createdDate === null) return 0
            // If only 'a' is null, push 'a' to the end (return positive)
            if (a.createdDate === null) return 1
            // If only 'b' is null, push 'b' to the end (return negative)
            if (b.createdDate === null) return -1

            // Both are valid dates, subtract timestamps
            return a.createdDate - b.createdDate
          })
          this.instances = rows.filter((row) => row.exerciseDefinitionId === this.exerciseId)
        } catch (error) {
          console.error(error)
          alert('Error while loading record.')
        }
      }

      if (!this.exercise) {
        this.$router.push({ name: 'exercise', params: { exerciseId: 'new' } })
      }

      this.loading = false
    },
    edit() {
      this.mode = 'edit'
    },
    async deleteRow() {
      if (!this.exercise) return
      try {
        this.showDeleteModal = false
        this.loading = true
        await this.manager.delete(this.exercise)
        this.$router.push({ name: 'exercises' })
      } catch (error) {
        this.loading = false
        console.error(error)
        alert('Error while deleting the record.')
      }
    },
    async save() {
      if (!this.exercise) return
      try {
        this.mode = 'view' // so updates seems instant

        await this.manager.save(this.exercise)

        // after save
        if (this.exerciseId == 'new') {
          this.$router.push({ name: 'exercise', params: { exerciseId: this.exercise.id } })
        }
      } catch (error) {
        this.mode = 'edit' // rollback mode to edit
        console.error(error)
        alert('Error while saving the record.')
      }
    },
    cancel() {
      if (this.exerciseId == 'new') {
        this.$router.push({ name: 'exercises' })
        return
      }
      this.mode = 'view'
      this.loadRecord()
    },
  },
  mounted() {
    //
  },
})
</script>
