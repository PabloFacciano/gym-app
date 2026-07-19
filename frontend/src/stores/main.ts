import { defineStore } from 'pinia'
export interface MainState {}

export type MainGetters = {} & Record<string, any>

export type MainActions = {}

export const mainStore = defineStore<'main', MainState, MainGetters, MainActions>('main', {
  state: () => ({}),
  getters: {},
  actions: {},
})
