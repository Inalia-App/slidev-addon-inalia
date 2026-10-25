import { describe, expect, it } from 'vitest'
import { publicBuildDefines } from '../../utils/public-build'

describe('public build credentials', () => {
  it.each([undefined, 'false', 'TRUE', '1'])('strips credentials unless explicitly opted in (%s)', (optIn) => {
    expect(publicBuildDefines('build', optIn)).toEqual({
      'import.meta.env.VITE_INALIA_API_KEY': 'undefined',
    })
  })

  it('preserves development credentials', () => {
    expect(publicBuildDefines('serve', undefined)).toEqual({})
  })

  it('allows an explicit live public build', () => {
    expect(publicBuildDefines('build', 'true')).toEqual({})
  })
})
