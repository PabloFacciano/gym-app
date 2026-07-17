import { defineStore } from 'pinia'
import { getSession, signIn } from '@/utils/supabase.js'
import type { Session } from '@supabase/supabase-js'


export type AppUser = {
  id: string
  name: string | null
  email: string
  picture: string | null
}

export interface AuthState {
  isLoggedIn: boolean
  session: Session | null
  sessionPromise: Promise<Session | null> | null
}

export type AuthGetters = {
  user: (state: AuthState) => AppUser | null
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
      const usr = state.session?.user;
      if (!usr) return null;

      return {
        id: usr?.id,
        name: usr?.user_metadata?.name ?? usr?.user_metadata?.full_name ?? 'unknown',
        email: usr?.email ?? 'unkown@unknown',
        picture: usr?.user_metadata?.avatar_url ?? null
      }
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
    },
  },
})
