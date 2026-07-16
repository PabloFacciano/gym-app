import { defineStore } from 'pinia'
import type {} from './types.js'

export interface MainState {
  hello: string
}

export type MainGetters = {
  hel: (state: MainState) => string
} & Record<string, any>

export type MainActions = {
  hi(): void
}

export const mainStore = defineStore<'main', MainState, MainGetters, MainActions>('main', {
  state: () => ({
    hello: 'world',
  }),
  getters: {
    hel(state) {
      return state.hello
    },
  },
  actions: {
    hi() {},
  },
})
