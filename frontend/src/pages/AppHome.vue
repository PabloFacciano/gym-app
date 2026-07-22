<template>
  <!-- AppHome -->
  <div>
    <AppNavbar />
    <AppCenter v-if="loadingExercises || loadingExerciseInstances">
      <AppLoader />
    </AppCenter>
    <AppCenter v-else>
      <AppWeekSelector v-model="selectedDate" @date-selected="loadExerciseInstances()" />
      <AppCard class="flex justify-between text-lg font-medium">
        <span>
          {{
            selectedDate.toLocaleDateString('es-AR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
          }}
        </span>
      </AppCard>
      <AppExerciseBuilder
        v-for="item in exerciseList"
        :key="item.exerciseDefinition.id"
        :exercise="item.exerciseDefinition"
        :exercise-instance="item.exerciseInstance"
      />
      <AppCard v-if="exercises.length > 0">
        <div class="text-lg font-medium">Agregar a la rutina</div>
        <AppDropdown v-model="selectedExerciseId" :list="availableExercises" :required="false" />
        <div class="flex justify-center space-x-3" v-if="selectedExerciseId">
          <AppButton type="primary" size="lg" :disabled="false" @click="addSelectedExercise">
            Agregar
          </AppButton>
        </div>
      </AppCard>
    </AppCenter>
  </div>
</template>

<script lang="ts">
import { ExerciseManager, type AppExerciseDefinition } from '@/backend/Exercise'
import { ExerciseInstanceManager, type AppExerciseInstance } from '@/backend/ExerciseInstance'
import AppButton from '@/components/AppButton.vue'
import type { SelectOption } from '@/components/AppDropdown.vue'
import AppDropdown from '@/components/AppDropdown.vue'
import AppLoader from '@/components/AppLoader.vue'
import AppCard from '@/custom/AppCard.vue'
import AppCenter from '@/custom/AppCenter.vue'
import AppExerciseBuilder from '@/custom/AppExerciseBuilder.vue'
import AppNavbar from '@/custom/AppNavbar.vue'
import AppWeekSelector from '@/custom/AppWeekSelector.vue'
import { defineComponent } from 'vue'

interface State {
  loadingExercises: boolean
  loadingExerciseInstances: boolean
  exercises: AppExerciseDefinition[]
  exerciseInstances: AppExerciseInstance[]
  selectedDate: Date
  selectedExerciseId: string | null
}

export default defineComponent({
  name: 'AppHome',
  props: {},
  data(): State {
    return {
      loadingExercises: false,
      loadingExerciseInstances: false,
      exercises: [],
      exerciseInstances: [],
      selectedDate: new Date(),
      selectedExerciseId: null,
    }
  },
  components: {
    AppNavbar,
    AppCenter,
    AppExerciseBuilder,
    AppLoader,
    AppWeekSelector,
    AppCard,
    AppDropdown,
    AppButton,
  },
  computed: {
    exerciseManager() {
      return ExerciseManager.getInstance()
    },
    exerciseInstanceManager() {
      return ExerciseInstanceManager.getInstance()
    },
    availableExercises(): SelectOption[] {
      return this.exercises.map((def) => {
        return {
          label: def.name ?? '',
          description: '',
          value: def.id,
        }
      })
    },
    exerciseList() {
      const exerciseInstaces = this.exerciseInstances.flatMap((instance) => {
        const definition = this.exercises.find((def) => def.id === instance.exerciseDefinitionId)
        if (!definition) return []
        return {
          exerciseDefinition: definition,
          exerciseInstance: instance,
        }
      })
      return exerciseInstaces
    },
  },
  methods: {
    addSelectedExercise() {
      const selected = this.selectedExerciseId
      if (!selected) return

      const EMPTY_DEFINITION = this.exerciseManager.newRow()
      this.exerciseInstances.push(
        this.exerciseInstanceManager.getNewByExerciseDefinition(
          this.exercises.find((def) => def.id === selected) ?? EMPTY_DEFINITION,
        ),
      )

      this.selectedExerciseId = null
    },
    async loadExercises() {
      this.loadingExercises = true
      try {
        this.exercises = await this.exerciseManager.getRows()
      } catch (error) {
        console.error(error)
        alert('Error in exercises load')
      }
      this.loadingExercises = false
    },
    async loadExerciseInstances() {
      if (this.loadingExerciseInstances) return
      this.loadingExerciseInstances = true
      try {
        this.exerciseInstances = await this.exerciseInstanceManager.getByDate(this.selectedDate)
      } catch (error) {
        console.error(error)
        alert('Error in exerciseInstance load')
      }
      this.loadingExerciseInstances = false
    },
  },
  mounted() {
    this.loadExercises()
    this.loadExerciseInstances()
  },
})
</script>
