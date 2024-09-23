import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './index.ts',
    { builder: 'mkdist', input: './types', outDir: 'dist/types', pattern: ['**/*.ts'], format: 'esm', loaders: ['js'] },
    { builder: 'mkdist', input: './composables', outDir: 'dist/composables', pattern: ['**/*.ts'], format: 'esm', loaders: ['js'] },
    {
      builder: 'mkdist',
      input: 'components',
      outDir: 'dist/components',
      pattern: '**/*.vue',
      loaders: ['vue'],
    },
  ],

  declaration: true,
  clean: true,
  externals: ['vue'],
})
