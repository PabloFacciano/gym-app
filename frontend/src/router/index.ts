import { createRouter, createWebHashHistory } from 'vue-router'
import { appRoutes } from '@/router/app.router'
import AppLandingPage from '@/pages/AppLandingPage.vue'
import AppError404 from '@/pages/AppError404.vue'
import { AuthStore } from '@/stores/auth'


const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: 'login',
      path: '/login',
      component: AppLandingPage,
      meta: { 
        redirectIfAuth: true,
        title: 'Ingresar'
      }
    },
    appRoutes,
    {
      name: 'landing',
      path: '',
      component: AppLandingPage,
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
  const auth = AuthStore()
  await auth.getSession()

  // Route requires auth, but user is not logged in
  if (to.matched.some(record => record.meta.requiresAuth) && !auth.isLoggedIn) {
    return next({ name: 'login' })
  }

  // Route is for guests (like login), but user is already logged in
  if (to.matched.some(record => record.meta.redirectIfAuth) && auth.isLoggedIn) {
    return next({ name: 'dashboard' })
  }

  // Get the title from route meta, or use a default title
  const DEFAULT_TITLE = 'GymApp';
  document.title = to.meta.title ? `${to.meta.title} — ${DEFAULT_TITLE}` : DEFAULT_TITLE;

  // Proceed normally
  next()
})

export default router
