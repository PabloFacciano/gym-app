<template>
  <div>
    <AppNavbar />
    <!-- List -->
    <div class="flex flex-col items-center p-3 sm:p-8">
      <div class="flex w-full flex-col space-y-3 sm:w-140 sm:space-y-6">
        <div class="flex items-center justify-end">
          <AppButton size="md" :disabled="false" type="primary" @click="newRecord"
            >&plus; Crear Ejercicio</AppButton
          >
        </div>
        <RouterLink
          :to="{ name: 'exercise', params: { exerciseId: exercise.id } }"
          v-for="exercise in exercises"
          :key="exercise.id"
          class="cursor-pointer space-y-6 rounded bg-neutral-700 p-6 shadow hover:bg-neutral-600 hover:shadow-lg"
        >
          <div class="text-xl font-medium" v-text="exercise.name"></div>
          <!-- Table -->
          <div
            v-if="hasMetrics(exercise)"
            class="[&::-webkit-scrollbar-track]:bg-scrollbar-track [&::-webkit-scrollbar-thumb]:bg-scrollbar-thumb overflow-x-auto rounded-lg border border-neutral-500 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-none"
          >
            <table class="min-w-full">
              <tbody class="divide-y divide-neutral-500">
                <tr v-for="metric in exercise.metrics">
                  <td
                    class="text-foreground px-4 py-3 text-sm font-medium whitespace-nowrap"
                    v-text="metric.name"
                  ></td>
                  <td
                    class="text-foreground px-4 py-3 text-sm whitespace-nowrap"
                    v-text="metric.defaultValue"
                  ></td>
                  <td
                    class="text-foreground px-4 py-3 text-sm whitespace-nowrap"
                    v-text="metric.measure"
                  ></td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- End Table -->
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ExerciseManager, type AppExerciseDefinition } from '@/backend/Exercise'
import AppButton from '@/components/AppButton.vue'
import AppNavbar from '@/custom/AppNavbar.vue'
import { defineComponent } from 'vue'

interface State {
  exercises: AppExerciseDefinition[]
}

export default defineComponent({
  name: 'AppExcercise',
  data(): State {
    return {
      exercises: [],
    }
  },
  components: {
    AppNavbar,
    AppButton,
  },
  computed: {
    manager() {
      return ExerciseManager.getInstance()
    },
  },
  methods: {
    hasMetrics(row: AppExerciseDefinition) {
      return this.manager.hasMetrics(row)
    },
    newRecord() {
      this.$router.push({ name: 'exercise', params: { exerciseId: 'new' } })
    },
    async loadRecords() {
      const manager = ExerciseManager.getInstance()
      try {
        this.exercises = await manager.getRows()
      } catch (error) {
        console.error(error)
        alert('Error in exercises sync')
      }
    },
  },
  mounted() {
    this.loadRecords()
  },
})
</script>
