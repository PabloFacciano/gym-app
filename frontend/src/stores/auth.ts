import { defineStore } from 'pinia'
import { supabase } from '@/utils/supabase.js'
const APP_DOMAIN = 'http://localhost:5173/'

export interface AuthState {
  user: null,
  session: null
}

export type AuthGetters = {
  loggedIn: (state: AuthState) => boolean
} // & Record<string, any>

export type AuthActions = {
  signIn(): Promise<void>
}

export const AuthStore = defineStore<'Auth', AuthState, AuthGetters, AuthActions>('Auth', {
  state: () => ({
    user: null,
    session: null
  }),
  getters: {
    loggedIn(state) {
      return state.user != null;
    },
  },
  actions: {
    async signIn() {
      const result = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: APP_DOMAIN + '#app'
        }
      })
      console.log("signIn", result)
    },
  },
})
