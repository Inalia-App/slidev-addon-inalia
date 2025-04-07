import { defineRoutesSetup } from '@slidev/types'

export default defineRoutesSetup((routes) => {
  return [
    ...routes,
    {
      path: '/inalia/dashboard',
      component: () => import('../pages/dashboard.vue'),
    },
  ]
})
