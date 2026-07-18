import { defineStore } from 'pinia'
import type { AppExerciseDefinition } from './types.js'

export interface MainState {
  backend: {
    exercises: AppExerciseDefinition[]
  }  
}

export type MainGetters = {
  hel: (state: MainState) => null
} & Record<string, any>

export type MainActions = {
  hi(): void
}

export const mainStore = defineStore<'main', MainState, MainGetters, MainActions>('main', {
  state: () => ({
    backend: {
      exercises: [
        {
          id: '1234',
          archived: false,
          userId: '1234',
          metrics: [
            {
              name: 'Repeticiones',
              measure: '',
              defaultValue: '10',
            },
            {
              name: 'Peso',
              measure: 'kg',
              defaultValue: '15',
            },
            {
              name: 'Distancia',
              measure: 'km',
              defaultValue: '5',
            },
          ],
          name: 'Biceps',
          createdDate: null,
          modifiedDate: null,
        }
      ]
    }    
  }),
  getters: {
    hel(_state) {
      return null
    },
  },
  actions: {
    hi() {},
  },
})
