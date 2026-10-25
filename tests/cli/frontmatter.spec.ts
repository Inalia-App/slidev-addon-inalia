import { describe, expect, it } from 'vitest'
import { parse } from 'yaml'
import { addInaliaAddon } from '../../bin/frontmatter.mjs'

describe('setup frontmatter', () => {
  it.each([
    'addons: [other-addon]',
    'addons:\n  - other-addon',
  ])('preserves existing addons: %s', (yaml) => {
    const result = addInaliaAddon(`---\n# Keep this comment\n${yaml}\n---\n\n# Slide`)
    const data = parse(result.split('---')[1])
    expect(data.addons).toEqual(['other-addon', 'slidev-addon-inalia'])
    expect(result).toContain('# Keep this comment')
    expect(result).toContain('\n\n# Slide')
    expect(addInaliaAddon(result)).toBe(result)
  })

  it('recognizes CRLF frontmatter and ignores mentions in the slide body', () => {
    const result = addInaliaAddon('---\r\ntitle: Talk\r\n---\r\nslidev-addon-inalia')
    expect(result.match(/title: Talk/g)).toHaveLength(1)
    expect(result).toContain('addons:')
    expect(result).not.toMatch(/(?<!\r)\n/)
  })

  it('rejects invalid frontmatter instead of rewriting it', () => {
    expect(() => addInaliaAddon('---\naddons: [\n---\n')).toThrow()
  })

  it('accepts the shorthand addon name without adding a duplicate', () => {
    const content = '---\naddons: [inalia]\n---\n'
    expect(addInaliaAddon(content)).toBe(content)
  })
})
