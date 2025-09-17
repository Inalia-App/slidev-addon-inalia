import { defineConfig } from 'tsdown'
import vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: ['./index.ts'],
  platform: 'browser',
  plugins: [vue({ isProduction: true })],
  dts: { vue: true },
})
