import { defineConfig } from 'tsdown'
import vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: ['./index.ts'],
  platform: 'neutral',
  plugins: [vue({ isProduction: true })],
  dts: { vue: true },
  external: ['#slidev/configs', '#slidev/slides', 'server-reactive:nav', 'server-reactive:drawings?diff', '@vue/devtools-api'],
})
