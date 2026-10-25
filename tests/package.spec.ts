import { readFile } from 'node:fs/promises'
import { expect, it } from 'vitest'

it('includes custom navigation controls in the npm package allowlist', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
  expect(pkg.files).toContain('custom-nav-controls.vue')
})
