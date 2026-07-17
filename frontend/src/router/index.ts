import { createRouter, createWebHashHistory } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { appRoutes } from '@/router/app.router'
import AppHomePage from '@/pages/AppHomePage.vue'
import AppError404 from '@/pages/AppError404.vue'


const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'login',
      path: '/login',
      component: AppHomePage,
      meta: { 
        redirectIfAuth: true,
        title: 'Ingresar'
      }
    },
    appRoutes,
    {
      name: 'landing',
      path: '',
      component: AppHomePage,
    },
    { 
      path: '/:pathMatch(.*)*', 
      alias: '/404',
      name: 'notfound',
      component: AppError404,
      meta: { 
        title: 'Página no encontrada'
      }
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  // Fetch the current session from Supabase
  const { data: { session } } = await supabase.auth.getSession()
  const isLoggedIn = !!session

  // Route requires auth, but user is not logged in
  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
    return next({ name: 'login' })
  }

  // Route is for guests (like login), but user is already logged in
  if (to.matched.some(record => record.meta.redirectIfAuth) && isLoggedIn) {
    return next({ name: 'dashboard' })
  }

  // Get the title from route meta, or use a default title
  const DEFAULT_TITLE = 'GymApp';
  document.title = to.meta.title ? `${to.meta.title} — ${DEFAULT_TITLE}` : DEFAULT_TITLE;

  // Proceed normally
  next()
})

export default router
