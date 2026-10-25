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

describe('demo mode', () => {
  it('uses the discovered account and supports empty mutation responses', async () => {
    request.mockResolvedValue(undefined)
    const { startDemoMode, stopDemoMode } = await import('../../utils/api')

    await expect(startDemoMode('owner/name')).resolves.toBeUndefined()
    await expect(stopDemoMode('owner/name')).resolves.toBeUndefined()

    expect(request).toHaveBeenCalledWith('/api/owner%2Fname/talks/7/demo-mode', { method: 'POST' })
    expect(request).toHaveBeenCalledWith('/api/owner%2Fname/talks/7/demo-mode', { method: 'DELETE' })
  })

  it.each(['startDemoMode', 'stopDemoMode'] as const)('propagates %s failures', async (method) => {
    const error = new Error('Forbidden')
    request.mockRejectedValueOnce(error)
    const api = await import('../../utils/api')

    await expect(api[method]('current-owner')).rejects.toBe(error)
  })
})

describe('account discovery', () => {
  it('uses the explicitly supplied token owner for all routes', async () => {
    request.mockImplementation(async (path: string) => {
      if (path === '/api/me')
        return { data: { username: 'current-owner' } }
      return { data: { number: 7 } }
    })
    const { fetchUsername, fetchTalk, fetchQuestion, runTalk } = await import('../../utils/api')

    const username = await fetchUsername()
    expect(username).toBe('current-owner')
    await Promise.all([fetchTalk(username), fetchQuestion(username, 2), runTalk(username)])

    expect(request.mock.calls.filter(([path]) => path === '/api/me')).toHaveLength(1)
    expect(request).toHaveBeenCalledWith('/api/current-owner/talks/7')
    expect(request).toHaveBeenCalledWith('/api/current-owner/talks/7/questions/2')
    expect(request).toHaveBeenCalledWith('/api/current-owner/talks/7/run', { method: 'POST' })
  })

  it.each([
    {},
    { data: {} },
    { data: { username: null } },
    { data: { username: '' } },
    { data: { username: '   ' } },
  ])('rejects account discovery without a valid username: %j', async (response) => {
    request.mockResolvedValueOnce(response)
    const { fetchUsername } = await import('../../utils/api')

    await expect(fetchUsername()).rejects.toThrow('Inalia account discovery failed: username is missing.')
    expect(request).toHaveBeenCalledExactlyOnceWith('/api/me')
  })

  it('propagates account discovery errors', async () => {
    const error = new Error('Unauthorized')
    request.mockRejectedValueOnce(error)
    const { fetchUsername } = await import('../../utils/api')

    await expect(fetchUsername()).rejects.toBe(error)
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('encodes the supplied username in route paths', async () => {
    request.mockResolvedValueOnce({ data: { number: 7 } })
    const { fetchTalk } = await import('../../utils/api')

    await fetchTalk('owner/name')

    expect(request).toHaveBeenLastCalledWith('/api/owner%2Fname/talks/7')
  })

  it('keeps requests for different accounts independent', async () => {
    request.mockResolvedValue({ data: { number: 7 } })
    const { fetchTalk } = await import('../../utils/api')

    await Promise.all([fetchTalk('first-owner'), fetchTalk('second-owner')])

    expect(request).toHaveBeenCalledWith('/api/first-owner/talks/7')
    expect(request).toHaveBeenCalledWith('/api/second-owner/talks/7')
  })
})
