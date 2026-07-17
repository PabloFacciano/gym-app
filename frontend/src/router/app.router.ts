import AppError404 from '@/pages/AppError404.vue'

export const appRoutes = {
  path: '/app',
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: '/users',
      children: [
        {
          name: 'user',
          path: '/:userId',
          component: AppError404,
        },
        {
          name: 'users',
          path: '',
          component: AppError404,
          meta: {
            title: 'Lista de Usuarios',
          },
        },
      ],
    },
    {
      path: '/exercises',
      children: [
        {
          name: 'exercise',
          path: '/:exerciseId',
          component: AppError404,
        },
        {
          name: 'exercises',
          path: '',
          component: AppError404,
          meta: {
            title: 'Lista de Ejercicios',
          },
        },
      ],
    },
    {
      name: 'app',
      component: AppError404,
      path: '',
      meta: {
        title: 'Inicio',
      },
    },
  ],
}
