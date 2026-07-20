<template>
  <div>
    <AppNavbar />
    <AppLoader v-if="loading" />
    <!-- List -->
    <AppCenter v-if="!loading">
      <div class="flex items-center justify-end">
        <AppButton size="md" :disabled="false" type="primary" @click="newRecord"
          >&plus; Crear Ejercicio</AppButton
        >
      </div>
      <RouterLink
        :to="{ name: 'exercise', params: { exerciseId: exercise.id } }"
        v-for="exercise in exercises"
        :key="exercise.id"
      >
        <AppCard class="cursor-pointer hover:bg-neutral-600 hover:shadow-lg">
          <div class="text-xl font-medium" v-text="exercise.name"></div>
          <!-- Table -->
          <div
            v-if="hasMetrics(exercise)"
            class="[&::-webkit-scrollbar-track]:bg-scrollbar-track [&::-webkit-scrollbar-thumb]:bg-scrollbar-thumb overflow-x-auto rounded-lg border border-neutral-500 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-none"
          >
            <table class="min-w-full">
              <tbody class="divide-y divide-neutral-500">
                <tr v-for="(metric, index) in exercise.metrics" :key="index">
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
        </AppCard>
      </RouterLink>
    </AppCenter>
  </div>
</template>

<script lang="ts">
import { ExerciseManager, type AppExerciseDefinition } from '@/backend/Exercise'
import AppNavbar from '@/custom/AppNavbar.vue'
import AppButton from '@/components/AppButton.vue'
import AppLoader from '@/components/AppLoader.vue'
import AppCenter from '@/custom/AppCenter.vue'
import { defineComponent } from 'vue'
import AppCard from '@/custom/AppCard.vue'

interface State {
  loading: boolean
  exercises: AppExerciseDefinition[]
}

export default defineComponent({
  name: 'AppExcercise',
  data(): State {
    return {
      loading: false,
      exercises: [],
    }
  },
  components: {
    AppNavbar,
    AppButton,
    AppLoader,
    AppCenter,
    AppCard,
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
      this.loading = true
      try {
        this.exercises = await this.manager.getRows()
      } catch (error) {
        console.error(error)
        alert('Error in exercises sync')
      }
      this.loading = false
    },
  },
  mounted() {
    this.loadRecords()
  },
})
</script>
