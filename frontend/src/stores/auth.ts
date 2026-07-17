import { defineStore } from 'pinia'
import { getSession, signIn, supabase } from '@/utils/supabase.js'
import type { Session, User } from '@supabase/supabase-js'


export interface AuthState {
  isLoggedIn: boolean
  session: Session | null
}

export type AuthGetters = {
  user: (state: AuthState) => User | null
} // & Record<string, any>

export type AuthActions = {
  signIn(): Promise<void>,
  getSession(): Promise<Session | null>
}



export const AuthStore = defineStore<'Auth', AuthState, AuthGetters, AuthActions>('Auth', {
  state: () => ({
    session: null,
    isLoggedIn: false
  }),
  getters: {
    user(state) {
      return state.session?.user ?? null;
    }
  },
  actions: {
    async getSession() {
      try {
        this.session = await getSession();
        console.log("getSession", this.session)
      } catch (error) {
        console.error("getSession failed", error)
      }
      this.isLoggedIn = this.session != null;
      return this.session;
    },
    async signIn() {
      await signIn();
      console.log("signIn")
    },
  },
})
