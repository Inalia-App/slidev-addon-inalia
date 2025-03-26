import { defineRoutesSetup } from '@slidev/types'

export default defineRoutesSetup((routes) => {
  return [
    ...routes,
    {
      path: '/audience-questions',
      component: () => import('../pages/audience-questions.vue'),
    },
  ]
})
