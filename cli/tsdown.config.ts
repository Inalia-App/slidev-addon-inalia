import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: { index: './index.ts' },
  outDir: '../dist/cli',
  tsconfig: './tsconfig.json',
  platform: 'node',
  format: 'esm',
  dts: false,
  clean: true,
})
