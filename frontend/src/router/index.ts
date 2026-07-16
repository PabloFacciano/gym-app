import { createRouter, createWebHashHistory } from 'vue-router'
import AppHomePage from '@/pages/AppHomePage.vue'
import AppError404 from '@/pages/AppError404.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: AppHomePage,
    },
    {
      path: '/404',
      component: AppError404,
    },
  ],
})

export default router
