<template>
  <!-- AppHome -->
  <div>
    <AppNavbar />
    <AppCenter v-if="loadingExercises || loadingExerciseInstances">
      <AppLoader />
    </AppCenter>
    <AppCenter v-else>
      <AppWeekSelector v-model="selectedDate" @date-selected="loadExerciseInstances()" />
      <AppCard>
        {{
          selectedDate.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })
        }}
      </AppCard>
      <AppExerciseBuilder
        v-for="item in exerciseList"
        :key="item.exerciseDefinition.id"
        :exercise="item.exerciseDefinition"
        :exercise-instance="item.exerciseInstance"
      />
    </AppCenter>
  </div>
</template>

<script lang="ts">
import { ExerciseManager, type AppExerciseDefinition } from '@/backend/Exercise'
import { ExerciseInstanceManager, type AppExerciseInstance } from '@/backend/ExerciseInstance'
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
    AppWeekSelector,
    AppCard,
  },
  computed: {
    exerciseManager() {
      return ExerciseManager.getInstance()
    },
    exerciseInstanceManager() {
      return ExerciseInstanceManager.getInstance()
    },
    exerciseList() {
      return this.exercises.map((def) => {

        let instance = this.exerciseInstances.find((_instance) => _instance.exerciseDefinitionId === def.id) ??
            this.exerciseInstanceManager.getNewByExerciseDefinition(def)
        instance.createdDate = new Date(this.selectedDate); // so it belongs to selected date
        instance.modifiedDate = new Date(this.selectedDate); // so it belongs to selected date

        return {
          exerciseDefinition: def,
          exerciseInstance: instance
        }
      })
    },
  },
  methods: {
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
