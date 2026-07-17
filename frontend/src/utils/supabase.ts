import { createClient } from "@supabase/supabase-js";
import router from '@/router/index'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Example
// export async function getTodos() {
//   const { data } = await supabase.from('todos').select()
//   return data;
// }


// Listen for auth changes to force route updates if a session expires
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    router.push({ path: 'login' })
  } else if (event === 'SIGNED_IN' && router.currentRoute.value.name === 'login') {
    router.push({ name: 'dashboard' })
  }
})