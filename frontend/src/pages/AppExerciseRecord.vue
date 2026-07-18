<template>
  <div>
    <AppNavbar />
    <div class="flex flex-col items-center justify-center space-y-4 p-8" v-if="loading">
      <div
        class="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"
      ></div>
      <div>Cargando...</div>
    </div>
    <!-- Record -->
    <div v-if="exercise && !loading" class="space-y-6 rounded bg-neutral-700 px-6 pt-6">
      <div class="flex flex-col items-center px-3 pt-3 sm:px-8 sm:pt-8">
        <div class="flex w-full flex-col space-y-4 sm:w-140 sm:space-y-6">
          <!-- Return link -->
          <RouterLink :to="{ name: 'exercises' }" class="text-app-lighter hover:underline"
            >&lt; Ir a Ejercicios</RouterLink
          >
          <!-- Title -->
          <div class="flex items-center justify-between">
            <div>
              <div v-if="mode == 'view'" class="text-xl font-medium" v-text="exercise.name"></div>
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
              <AppButton type="danger" size="sm" v-if="mode == 'view'" @click="delete"
                >Eliminar</AppButton
              >
              <AppButton type="primary" size="sm" v-if="mode == 'edit'" @click="save"
                >Guardar</AppButton
              >
              <AppButton type="secondary" size="sm" v-if="mode == 'edit'" @click="cancel"
                >Cancelar</AppButton
              >
            </div>
          </div>
          <!-- Table -->
          <div
            class="[&::-webkit-scrollbar-track]:bg-scrollbar-track [&::-webkit-scrollbar-thumb]:bg-scrollbar-thumb overflow-x-auto rounded-lg border border-neutral-500 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-none"
          >
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
                <tr v-for="metric in exercise.metrics">
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
                    <AppButton size="sm" type="danger">&times;</AppButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Tabs -->
          <div class="flex">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AppTextInput from '@/components/AppTextInput.vue'
import AppButton from '@/components/AppButton.vue'
import AppNavbar from '@/custom/AppNavbar.vue'
import { mainStore } from '@/stores/main'
import type { AppExerciseDefinition } from '@/stores/types'
import { DeepCopy } from '@/utils/utils'
import { mapState } from 'pinia'
import { defineComponent } from 'vue'

interface State {
  exercise: AppExerciseDefinition | null
  loading: boolean
  mode: 'view' | 'edit'
  tab: 'stats' | 'history'
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
      mode: 'view',
      tab: 'stats',
    }
  },
  components: {
    AppNavbar,
    AppButton,
    AppTextInput,
  },
  watch: {
    exerciseId: {
      handler() {
        this.loadRecord()
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState(mainStore, ['backend']),
  },
  methods: {
    loadRecord() {
      // search and clone exercise
      this.loading = true
      this.exercise = DeepCopy(
        this.backend.exercises.find((exercise) => exercise.id === this.exerciseId),
      )
      this.loading = false
    },
    edit() {
      this.mode = 'edit'
    },
    delete() {},
    save() {
      this.mode = 'view'
    },
    cancel() {
      this.loadRecord()
      this.mode = 'view'
    },
  },
  mounted() {
    //
  },
})
</script>
