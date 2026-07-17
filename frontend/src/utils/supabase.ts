import { createClient } from '@supabase/supabase-js'
import router from '@/router/index'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)

// Register this immediately after calling createClient!
// Because signInWithOAuth causes a redirect, you need to fetch the
// provider tokens from the callback.
// Listen for auth changes to force route updates if a session expires
supabase.auth.onAuthStateChange((event, session) => {
  if (session && session.provider_token) {
    window.localStorage.setItem('oauth_provider_token', session.provider_token)
  }

  if (session && session.provider_refresh_token) {
    window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token)
  }

  if (event === 'SIGNED_OUT') {
    window.localStorage.removeItem('oauth_provider_token')
    window.localStorage.removeItem('oauth_provider_refresh_token')
    router.push({ name: 'login' })
    return
  }

  if (event === 'SIGNED_IN' && router.currentRoute.value.name === 'login') {
    router.push({ name: 'app' })
    return
  }
})

export async function signIn() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '#/app', // (Protocol + Domain + Port) + #/app
    },
  })
  if (error) throw error
}

export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  if (error) throw error
  return session
}
