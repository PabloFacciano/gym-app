import AppExercise from '@/pages/AppExercise.vue'
import AppExerciseRecord from '@/pages/AppExerciseRecord.vue'
import AppHome from '@/pages/AppHome.vue'
import AppUser from '@/pages/AppUser.vue'

export const appRoutes = {
  path: '/app',
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: 'users',
      children: [
        {
          name: 'user',
          path: ':userId',
          component: AppUser,
          props: true,
        },
        {
          name: 'users',
          path: '',
          component: AppUser,
          meta: {
            title: 'Lista de Usuarios',
          },
        },
      ],
    },
    {
      path: 'exercises',
      children: [
        {
          name: 'exercise',
          path: ':exerciseId',
          component: AppExerciseRecord,
          props: true,
        },
        {
          name: 'exercises',
          path: '',
          component: AppExercise,
          meta: {
            title: 'Lista de Ejercicios',
          },
        },
      ],
    },
    {
      name: 'app',
      component: AppHome,
      path: '',
      meta: {
        title: 'Inicio',
      },
    },
  ],
}
