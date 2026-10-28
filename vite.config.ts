import { defineConfig } from 'vite'
import { inaliaEnvPlugin } from './plugins/env'
import { inaliaOAuthPlugin } from './plugins/oauth'

export default defineConfig({
  plugins: [
    inaliaEnvPlugin(),
    inaliaOAuthPlugin(),
  ],

  optimizeDeps: {
    include: [
      'slidev-addon-inalia > pusher-js',
    ],
  },
})
