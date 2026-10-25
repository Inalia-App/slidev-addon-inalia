import { describe, expect, it } from 'vitest'
import { mergeInaliaEnv } from '../../bin/env.mjs'

const values = {
  VITE_INALIA_API_KEY: 'new-token',
  VITE_INALIA_USERNAME: 'speaker',
  VITE_INALIA_TALK_NUMBER: '1',
}

describe('setup environment', () => {
  it('preserves unrelated variables and comments while replacing existing values', () => {
    const result = mergeInaliaEnv('# Keep me\nOTHER=value\nVITE_INALIA_API_KEY=old\n', values)
    expect(result).toContain('# Keep me\nOTHER=value\n')
    expect(result).toContain('VITE_INALIA_API_KEY="new-token"')
    expect(result).not.toContain('=old')
    expect(mergeInaliaEnv(result, values)).toBe(result)
  })

  it('creates a new file and preserves CRLF in existing files', () => {
    expect(mergeInaliaEnv('', values)).toContain('VITE_INALIA_USERNAME="speaker"')
    expect(mergeInaliaEnv('OTHER=value\r\n', values)).not.toMatch(/(?<!\r)\n/)
  })
})
