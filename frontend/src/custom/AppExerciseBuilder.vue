<template>
  <AppCard
    v-if="exercise && exerciseCopy"
    class="select-none"
    :class="{ 'cursor-pointer opacity-50': closed }"
    @click="openByClickingHeader"
  >
    <!-- Header -->
    <div class="flex items-center space-x-6">
      <div>
        <img
          class="pointer-events-none h-6 w-6"
          draggable="false"
          src="https://img.icons8.com/ffffff/ios-filled/50/dumbbell.png"
          alt="ejercicio"
        />
      </div>
      <div class="grow text-xl font-medium" v-text="exercise.name"></div>
      <!-- subicons -->
      <div class="flex space-x-3">
        <div
          @click.stop="toggleCardVisibility"
          class="cursor-pointer rounded-full p-3 hover:bg-neutral-500"
          :class="{ 'bg-neutral-600': !closed }"
        >
          <img
            v-if="!closed"
            class="pointer-events-none h-6 w-6"
            src="https://img.icons8.com/ffffff/material-sharp/24/chevron-up.png"
            alt="Contraer"
          />
          <img
            v-if="closed"
            class="pointer-events-none h-6 w-6"
            src="https://img.icons8.com/ffffff/material-sharp/24/chevron-down.png"
            alt="Expandir"
          />
        </div>
      </div>
    </div>
    <!-- Metrics -->
    <div
      v-if="hasMetrics && !closed"
      class="overflow-x-auto rounded-lg border border-neutral-500"
      :class="{ 'cursor-pointer hover:bg-neutral-600': !editingMetrics }"
      @click="editingMetrics = true"
    >
      <div class="min-w-full divide-y divide-neutral-500">
        <div
          class="grid grid-cols-3 gap-3 px-4"
          :class="{ 'py-3': !editingMetrics }"
          v-for="(metric, index) in exercise.metrics"
          :key="index"
        >
          <div
            class="flex w-auto items-center truncate text-sm font-medium whitespace-nowrap"
            v-text="metric.name"
          ></div>
          <div class="flex items-center text-sm font-medium whitespace-nowrap">
            <div v-if="!editingMetrics" v-text="exerciseCopy['metric0' + (index + 1)]"></div>
            <AppTextInput
              v-if="editingMetrics"
              v-model="exerciseCopy['metric0' + (index + 1)]"
              type="number"
              placeholder="Valor"
              :maxlength="50"
              :required="false"
              :minimun="0"
              :maximun="1000000000"
            />
          </div>
          <div
            class="flex items-center text-sm font-medium whitespace-nowrap"
            v-text="metric.measure"
          ></div>
        </div>
      </div>
    </div>
    <div class="flex justify-end" v-if="editingMetrics && !closed">
      <AppButton type="primary" size="sm" @click="saveMetrics">Guardar</AppButton>
    </div>
    <!-- Elapsed time  -->
    <div class="grid grid-cols-2 text-center" v-if="!closed">
      <div
        class="cursor-pointer space-y-3 rounded p-3 transition-[background-color] duration-1000"
        :class="{
          'border-app border': state === 'exercise',
          'bg-app': exerciseSeconds % 2 == 1 && state === 'exercise',
          'bg-neutral-700': exerciseSeconds % 2 == 0 && state === 'exercise',
        }"
        @click="btnContinue"
      >
        <div>Ejercicio</div>
        <div class="text-lg font-medium">
          {{
            formatTime(
              (exerciseCopy?.exerciseDuration ?? 0) + (state == 'exercise' ? exerciseSeconds : 0),
            )
          }}
        </div>
      </div>
      <div
        class="cursor-pointer space-y-3 rounded p-3 transition-[background-color] duration-1000"
        :class="{
          'border-app border': state === 'pause',
          'bg-app': exerciseSeconds % 2 == 1 && state === 'pause',
          'bg-neutral-700': exerciseSeconds % 2 == 0 && state === 'pause',
        }"
        @click="btnPause"
      >
        <div>Descanso</div>
        <div class="text-lg font-medium">
          {{
            formatTime((exerciseCopy?.restDuration ?? 0) + (state == 'pause' ? exerciseSeconds : 0))
          }}
        </div>
      </div>
    </div>
    <!-- Action -->
    <AppLoader v-if="savingInstance && !closed">Guardando ejercicio...</AppLoader>
    <div class="flex justify-center space-x-3" v-if="!closed && !savingInstance">
      <AppButton
        type="primary"
        size="lg"
        :disabled="false"
        @click="btnStart"
        icon="https://img.icons8.com/ffffff/ios-filled/50/play--v1.png"
        v-if="state == 'end'"
      >
        Comenzar
      </AppButton>
      <AppButton
        type="secondary"
        size="lg"
        icon="https://img.icons8.com/ffffff/ios-filled/50/stop--v1.png"
        :disabled="false"
        @click="btnEnd"
        v-if="state == 'pause'"
      >
        Finalizar
      </AppButton>
      <AppButton
        type="secondary"
        size="lg"
        :disabled="false"
        icon="https://img.icons8.com/ffffff/ios-filled/50/pause--v1.png"
        @click="btnPause"
        v-if="state == 'exercise'"
      >
        Pausa
      </AppButton>
      <AppButton
        type="secondary"
        size="lg"
        icon="https://img.icons8.com/ffffff/ios-filled/50/play--v1.png"
        :disabled="false"
        @click="btnContinue"
        v-if="state == 'pause'"
      >
        Continuar
      </AppButton>
    </div>
  </AppCard>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppCard from './AppCard.vue'
import { ExerciseManager, type AppExerciseDefinition } from '@/backend/Exercise.ts'
import { ExerciseInstanceManager, type AppExerciseInstance } from '@/backend/ExerciseInstance.ts'
import AppTextInput from '@/components/AppTextInput.vue'
import AppButton from '@/components/AppButton.vue'
import { deepCopy } from '@/utils/utils.ts'
import AppLoader from '@/components/AppLoader.vue'

interface State {
  state: 'end' | 'exercise' | 'pause'
  closed: boolean
  editingMetrics: boolean
  exerciseCopy: AppExerciseInstance | null
  now: Date
  nowTimer: number | null
  lastStartedDate: Date
  savingInstance: boolean
}

export default defineComponent({
  name: 'AppExerciseBuilder',
  props: {
    exercise: {
      type: Object as PropType<AppExerciseDefinition>,
      required: true,
    },
    exerciseInstance: {
      type: Object as PropType<AppExerciseInstance | null>,
      required: false,
      default: null,
    },
  },
  data(): State {
    return {
      state: 'end',
      closed: true,
      editingMetrics: false,
      exerciseCopy: null,
      now: new Date(),
      nowTimer: null,
      lastStartedDate: new Date(),
      savingInstance: false,
    }
  },
  components: {
    AppCard,
    AppTextInput,
    AppButton,
    AppLoader,
  },
  watch: {
    exerciseInstance: {
      handler() {
        this.exerciseCopy = deepCopy(this.exerciseInstance)
      },
      immediate: true,
    },
  },
  computed: {
    exerciseManager() {
      return ExerciseManager.getInstance()
    },
    exerciseInstanceManager() {
      return ExerciseInstanceManager.getInstance()
    },
    hasMetrics(): boolean {
      return this.exerciseManager.hasMetrics(this.exercise)
    },
    exerciseSeconds(): number {
      return Math.round(Math.abs(this.now.getTime() - this.lastStartedDate.getTime()) / 1000)
    },
  },
  methods: {
    btnStart() {
      if (!this.exerciseCopy) return
      this.editingMetrics = true
      this.lastStartedDate = new Date()
      this.state = 'exercise'
    },
    btnPause() {
      this.updateExerciseCopyTime()
      this.state = 'pause'
    },
    btnContinue() {
      this.updateExerciseCopyTime()
      this.state = 'exercise'
    },
    async btnEnd() {
      try {
        this.editingMetrics = false
        this.state = 'end'
        this.closed = true
        this.saveRecord()
      } catch (error) {
        console.error(error)
        // rollback to pause state
        this.closed = false
        this.state = 'pause'
        alert('Save exerciseInstance failed')
      }
    },
    async saveMetrics() {
      try {
        this.editingMetrics = false
        this.saveRecord()
      } catch (error) {
        this.editingMetrics = true
        console.error(error)
        // rollback to pause state
        alert('Save exerciseInstance failed')
      }
    },
    async saveRecord() {
      if (!this.exerciseCopy || this.savingInstance) return
      this.savingInstance = true
      this.updateExerciseCopyTime()
      await this.exerciseInstanceManager.save(this.exerciseCopy)
      this.savingInstance = false
    },
    updateExerciseCopyTime() {
      if (!this.exerciseCopy) return

      // add to existing metric/field
      if (this.state == 'pause') {
        this.exerciseCopy.restDuration = this.exerciseCopy.restDuration + this.exerciseSeconds
      } else if (this.state == 'exercise') {
        this.exerciseCopy.exerciseDuration =
          this.exerciseCopy.exerciseDuration + this.exerciseSeconds
      }

      // reset
      this.lastStartedDate = new Date()
    },
    formatTime(seconds: number) {
      return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`
    },
    openByClickingHeader() {
      if (this.closed) this.toggleCardVisibility()
    },
    toggleCardVisibility() {
      this.closed = !this.closed
      if ((this.state != 'end' || this.editingMetrics) && this.closed) {
        // now the card is closed, end the exercise
        this.btnEnd()
      }
    },
  },
  mounted() {
    this.nowTimer = window.setInterval(() => {
      this.now = new Date()
    }, 50)
  },
  unmounted() {
    if (this.nowTimer) window.clearInterval(this.nowTimer)
  },
})
</script>
