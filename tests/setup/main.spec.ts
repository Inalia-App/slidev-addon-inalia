import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { fetchUsername, fetchTalk, echo } = vi.hoisted(() => ({
  fetchUsername: vi.fn(),
  fetchTalk: vi.fn(),
  echo: vi.fn(class {}),
}))

vi.mock('@slidev/types', () => ({ defineAppSetup: (setup: unknown) => setup }))
vi.mock('../../utils/api', () => ({ fetchUsername, fetchTalk }))
vi.mock('laravel-echo', () => ({ default: echo }))
vi.mock('pusher-js', () => ({ default: vi.fn() }))

beforeEach(() => {
  vi.resetModules()
  vi.clearAllMocks()
  fetchUsername.mockResolvedValue('current-owner')
  fetchTalk.mockResolvedValue({ number: 7 })
  vi.stubEnv('VITE_INALIA_API_KEY', 'token')
  vi.stubEnv('VITE_INALIA_TALK_NUMBER', '7')
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('deck startup', () => {
  it('discovers the account before connecting or fetching the talk', async () => {
    let resolveUsername!: (username: string) => void
    fetchUsername.mockReturnValue(new Promise<string>((resolve) => {
      resolveUsername = resolve
    }))
    const { default: setup } = await import('../../setup/main')
    const provide = vi.fn()
    const startup = setup({ app: { provide } } as any)

    expect(fetchUsername).toHaveBeenCalledTimes(1)
    expect(echo).not.toHaveBeenCalled()
    expect(fetchTalk).not.toHaveBeenCalled()

    resolveUsername('current-owner')
    await startup

    expect(echo).toHaveBeenCalledTimes(1)
    expect(fetchTalk).toHaveBeenCalledExactlyOnceWith('current-owner')
    expect(provide).toHaveBeenCalledWith('username', 'current-owner')
    expect(provide).toHaveBeenCalledWith('talk', { number: 7 })
  })

  it('starts OAuth without a username environment variable', async () => {
    vi.stubGlobal('__INALIA_OAUTH_MODE__', true)
    vi.stubGlobal('__INALIA_OAUTH_SESSION__', 'local-session')
    vi.stubEnv('VITE_INALIA_API_KEY', '')
    vi.stubEnv('VITE_INALIA_USERNAME', undefined)
    const { default: setup } = await import('../../setup/main')
    const provide = vi.fn()

    await setup({ app: { provide } } as any)

    expect(fetchUsername).toHaveBeenCalledTimes(1)
    expect(fetchTalk).toHaveBeenCalledExactlyOnceWith('current-owner')
    expect(provide).toHaveBeenCalledWith('username', 'current-owner')
  })

  it('does not discover the account in static mode', async () => {
    vi.stubEnv('VITE_INALIA_API_KEY', '')
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'info').mockImplementation(() => {})
    const { default: setup } = await import('../../setup/main')

    await setup({ app: { provide: vi.fn() } } as any)

    expect(fetchUsername).not.toHaveBeenCalled()
    expect(echo).not.toHaveBeenCalled()
    expect(fetchTalk).not.toHaveBeenCalled()
  })

  it('stops startup if account discovery fails', async () => {
    const error = new Error('Unauthorized')
    fetchUsername.mockRejectedValue(error)
    const { default: setup } = await import('../../setup/main')

    await expect(setup({ app: { provide: vi.fn() } } as any)).rejects.toBe(error)

    expect(fetchUsername).toHaveBeenCalledTimes(1)
    expect(echo).not.toHaveBeenCalled()
    expect(fetchTalk).not.toHaveBeenCalled()
  })
})
