import type { Plugin } from 'vite'
import process from 'node:process'
import { readUser } from 'rc9'
import { loadEnv } from 'vite'
import { publicBuildDefines } from '../utils/public-build'

export function inaliaEnvPlugin(): Plugin {
  return {
    // Cannot modify `config.env` directly, so we set it in `process.env`.
    // @see https://github.com/vitejs/vite/blob/657c2fa1af8f63553c5a3622f6d4cda846415b5e/packages/vite/src/node/config.ts#L1585-L1588
    name: 'inalia:env',
    config: (_config, { command, mode }) => {
      const userConfig = readUser('.inaliarc')
      const envConfig = loadEnv(mode, process.cwd())

      if (userConfig && typeof userConfig === 'object') {
        // Inject all top-level keys from userConfig as VITE_ env vars (recursively for objects)
        injectEnvVars(userConfig, envConfig)
      }

      const allowPublicToken = envConfig.VITE_INALIA_ALLOW_PUBLIC_TOKEN
        ?? process.env.VITE_INALIA_ALLOW_PUBLIC_TOKEN
      if (command === 'build' && allowPublicToken === 'true') {
        console.warn('[slidev-addon-inalia] Live public build enabled: the API token will be visible to all visitors.')
      }
      return { define: publicBuildDefines(command, allowPublicToken) }
    },
  }
}

function injectEnvVars(obj: Record<string, any>, env: Record<string, any>, prefix = 'VITE_'): void {
  for (const [key, value] of Object.entries(obj)) {
    const envKey = prefix + key.toUpperCase()
    if (typeof value === 'object' && value !== null) {
      injectEnvVars(value, env, `${envKey}_`)
    }
    else if (value !== undefined && !(envKey in env)) {
      // Avoid overwriting existing env vars (.env > ~/.inaliarc)
      process.env[envKey] = String(value)
    }
  }
}
