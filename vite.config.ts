import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    include: [
      'slidev-addon-inalia > pusher-js',
      'slidev-addon-inalia > to-px',
      'slidev-addon-inalia > striptags',
    ],
  },
})
