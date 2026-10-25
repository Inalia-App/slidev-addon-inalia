import { describe, expect, it } from 'vitest'
import { mergeInaliaEnv } from '../../cli/env'

const values = {
  VITE_INALIA_API_KEY: 'new-token',
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

  it('can update only the talk number without changing credentials', () => {
    const content = '# Settings\nVITE_INALIA_API_KEY=secret\nVITE_INALIA_USERNAME=speaker\nVITE_INALIA_TALK_NUMBER=1\n'
    expect(mergeInaliaEnv(content, { VITE_INALIA_TALK_NUMBER: '2' })).toBe(
      '# Settings\nVITE_INALIA_API_KEY=secret\nVITE_INALIA_USERNAME=speaker\nVITE_INALIA_TALK_NUMBER="2"\n',
    )
  })

  it('does not require a username and preserves obsolete configuration without using it', () => {
    expect(mergeInaliaEnv('', values)).not.toContain('VITE_INALIA_USERNAME')
    expect(mergeInaliaEnv('VITE_INALIA_USERNAME=old-speaker\n', values))
      .toContain('VITE_INALIA_USERNAME=old-speaker')
  })

  it('clears an old API key when switching to OAuth without changing unrelated settings', () => {
    const result = mergeInaliaEnv('VITE_INALIA_API_KEY=old-secret\nOTHER=keep\n', {
      ...values, VITE_INALIA_API_KEY: '', VITE_INALIA_AUTH: 'oauth', VITE_INALIA_ENDPOINT: 'https://inalia.app',
    })
    expect(result).not.toContain('old-secret')
    expect(result).toContain('VITE_INALIA_API_KEY=""')
    expect(result).toContain('VITE_INALIA_AUTH="oauth"')
    expect(result).toContain('OTHER=keep')
  })

  it('preserves managed keys not included in a partial update', () => {
    expect(mergeInaliaEnv('VITE_INALIA_API_KEY=keep\n', { VITE_INALIA_AUTH: 'token' })).toContain('VITE_INALIA_API_KEY=keep')
  })

  it('creates a new file and preserves CRLF in existing files', () => {
    expect(mergeInaliaEnv('', values)).toContain('VITE_INALIA_TALK_NUMBER="1"')
    expect(mergeInaliaEnv('OTHER=value\r\n', values)).not.toMatch(/(?<!\r)\n/)
  })
})
