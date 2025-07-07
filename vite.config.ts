import process from 'node:process'
import { readUser } from 'rc9'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    (() => {
      return {
        // Cannot modify `config.env` directly, so we set it in `process.env`.
        // @see https://github.com/vitejs/vite/blob/657c2fa1af8f63553c5a3622f6d4cda846415b5e/packages/vite/src/node/config.ts#L1585-L1588
        name: 'inalia:env',
        config: () => {
          const userConfig = readUser('.inaliarc')

          if (userConfig && typeof userConfig === 'object') {
            // Inject all top-level keys from userConfig as VITE_ env vars (recursively for objects)
            injectEnvVars(userConfig)
          }
        },
      }
    })(),
  ],

  optimizeDeps: {
    include: [
      'slidev-addon-inalia > pusher-js',
      'slidev-addon-inalia > to-px',
      'slidev-addon-inalia > striptags',
    ],
  },
})

function injectEnvVars(obj: Record<string, any>, prefix = 'VITE_') {
  for (const [key, value] of Object.entries(obj)) {
    const envKey = prefix + key.toUpperCase()
    if (typeof value === 'object' && value !== null) {
      injectEnvVars(value, `${envKey}_`)
    }
    else if (value !== undefined) {
      process.env[envKey] = String(value)
    }
  }
}
