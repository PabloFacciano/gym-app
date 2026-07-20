<template>
  <!-- AppHome -->
  <div>
    <AppNavbar />
    <AppCenter v-if="loadingExercises || loadingExerciseInstances">
      <AppLoader />
    </AppCenter>
    <AppCenter v-else>
      <AppExerciseBuilder
        v-for="exercise in exercises"
        :key="exercise.id"
        :exercise="exercise"
        :exercise-instance="getInstanceByExercercise(exercise)"
      />
    </AppCenter>
  </div>
</template>

<script lang="ts">
import { ExerciseManager, type AppExerciseDefinition } from '@/backend/Exercise'
import { ExerciseInstanceManager, type AppExerciseInstance } from '@/backend/ExerciseInstance'
import AppLoader from '@/components/AppLoader.vue'
import AppCenter from '@/custom/AppCenter.vue'
import AppExerciseBuilder from '@/custom/AppExerciseBuilder.vue'
import AppNavbar from '@/custom/AppNavbar.vue'
import { defineComponent } from 'vue'

interface State {
  loadingExercises: boolean
  loadingExerciseInstances: boolean
  exercises: AppExerciseDefinition[]
  exerciseInstances: AppExerciseInstance[]
  selectedDate: Date
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
    }
  },
  components: {
    AppNavbar,
    AppCenter,
    AppExerciseBuilder,
    AppLoader,
  },
  watch: {},
  computed: {
    exerciseManager() {
      return ExerciseManager.getInstance()
    },
    exerciseInstanceManager() {
      return ExerciseInstanceManager.getInstance()
    },
  },
  methods: {
    getInstanceByExercercise(exercise: AppExerciseDefinition) {
      const row = this.exerciseInstances.find(
        (instance) => instance.exerciseDefinitionId === exercise.id,
      )
      if (row) return row

      const newRow = this.exerciseInstanceManager.getNewByExerciseDefinition(exercise)
      return newRow
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
