import { defineStore } from 'pinia'
import { getSession, signIn, supabase } from '@/utils/supabase.js'
import type { Session, User } from '@supabase/supabase-js'


export interface AuthState {
  isLoggedIn: boolean
  session: Session | null
  sessionPromise: Promise<Session | null> | null
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
    isLoggedIn: false,
    sessionPromise: null
  }),
  getters: {
    user(state) {
      return state.session?.user ?? null;
    }
  },
  actions: {
    async getSession() {
      if (this.sessionPromise) {
        return this.sessionPromise;
      }

      this.sessionPromise = (async () => {
        try {
          this.session = await getSession();
          console.log("getSession", this.session);
        } catch (error) {
          this.session = null; 
          console.error("getSession failed", error);
        } finally {
          this.sessionPromise = null;
        }
        
        this.isLoggedIn = this.session != null;
        return this.session;
      })();

      return this.sessionPromise;
    },
    async signIn() {
      await signIn();
      console.log("signIn")
    },
  },
})
