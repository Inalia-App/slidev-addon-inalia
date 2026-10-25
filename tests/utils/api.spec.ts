import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { request } = vi.hoisted(() => ({ request: vi.fn() }))

vi.mock('ofetch', () => ({ ofetch: { create: () => request } }))

beforeEach(() => {
  vi.resetModules()
  request.mockReset()
  vi.stubEnv('VITE_INALIA_TALK_NUMBER', '7')
  vi.stubEnv('VITE_INALIA_USERNAME', 'obsolete-username')
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('account discovery', () => {
  it('uses the token owner for all routes and shares one account lookup', async () => {
    request.mockImplementation(async (path: string) => {
      if (path === '/api/me')
        return { data: { username: 'current-owner' } }
      return { data: { number: 7 } }
    })
    const { fetchTalk, fetchQuestion, runTalk } = await import('../../utils/api')

    await Promise.all([fetchTalk(), fetchQuestion(2), runTalk()])

    expect(request.mock.calls.filter(([path]) => path === '/api/me')).toHaveLength(1)
    expect(request).toHaveBeenCalledWith('/api/current-owner/talks/7')
    expect(request).toHaveBeenCalledWith('/api/current-owner/talks/7/questions/2')
    expect(request).toHaveBeenCalledWith('/api/current-owner/talks/7/run', { method: 'POST' })
  })

  it('propagates discovery errors without requesting a talk and allows retry', async () => {
    const error = new Error('Unauthorized')
    request.mockRejectedValueOnce(error)
    const { fetchTalk } = await import('../../utils/api')

    await expect(fetchTalk()).rejects.toBe(error)
    expect(request).toHaveBeenCalledTimes(1)

    request.mockResolvedValueOnce({ data: { username: 'owner' } })
      .mockResolvedValueOnce({ data: { number: 7 } })
    await expect(fetchTalk()).resolves.toEqual({ number: 7 })
    expect(request).toHaveBeenLastCalledWith('/api/owner/talks/7')
  })
})
