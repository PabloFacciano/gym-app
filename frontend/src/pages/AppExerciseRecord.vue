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
                <tr v-for="(metric, index) in exercise.metrics">
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
                      :required="true"
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
          <div class="flex -mb-8" v-if="mode == 'view'">
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
            <AppChart :data="chartData" />

            <!-- Labels -->
            <div class="space-y-3 py-4">
              <div
                v-for="(serie, i) in chartData"
                :key="i"
                class="flex items-center space-x-4 rounded bg-neutral-900 p-3"
              >
                <div
                  class="h-4 w-4 rounded-full"
                  :class="{
                    'bg-emerald-500': i == 0,
                    'bg-sky-500': i == 1,
                  }"
                ></div>
                <div>{{ serie.name }}</div>
              </div>
            </div>
          </div>
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
import AppChart, { type ChartSerie } from '@/components/AppChart.vue'
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

interface State {
  exercise: AppExerciseDefinition | null
  loading: boolean
  mode: 'view' | 'edit'
  tab: 'stats' | 'history'
  stats: {
    period: string
    list: SelectOption[]
  }
  showDeleteModal: boolean
  chartData: ChartSerie[]
}

export default defineComponent({
  name: 'AppExcerciseRecord',
  props: {
    exerciseId: String,
  },
  data(): State {
    return {
      exercise: null,
      loading: false,
      showDeleteModal: false,
      mode: 'view',
      tab: 'stats',
      chartData: [
        {
          name: 'Series A (Green Allocation)',
          values: [
            { value: 10, date: new Date('2026-03-10T00:00:00-03:00') },
            { value: 15, date: new Date('2026-03-12T08:30:00-03:00') },
            { value: 20, date: new Date('2026-05-13T12:00:00-03:00') },
            { value: 25, date: new Date('2026-03-15T08:30:00-03:00') },
            { value: 30, date: new Date('2026-05-18T12:00:00-03:00') },
            { value: 35, date: new Date('2026-07-20T23:59:59-03:00') },
          ],
        },
        {
          name: 'Series B (Blue Network)',
          values: [
            { value: 110, date: new Date('2026-03-10T00:00:00-03:00') },
            { value: 120, date: new Date('2026-03-12T08:30:00-03:00') },
            { value: 130, date: new Date('2026-05-03T12:00:00-03:00') },
            { value: 140, date: new Date('2026-07-20T23:59:59-03:00') },
          ],
        },
      ],
      stats: {
        period: 'last30days',
        list: [
          {
            label: 'Ultimos 30 días',
            description: '',
            value: 'last30days',
          },
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
    AppChart,
    AppCenter,
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
        this.mode = 'edit'
      } else {
        try {
          this.exercise = await this.manager.getById(this.exerciseId ?? '')
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
