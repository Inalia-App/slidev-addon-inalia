// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { allowedProxyRequest, inaliaOAuthPlugin, isLocalRequest } from '../../plugins/oauth'

const { environment } = vi.hoisted(() => ({ environment: {} as Record<string, string> }))
vi.mock('vite', () => ({ loadEnv: () => environment }))
vi.mock('../../plugins/oauth/client', () => ({ accessToken: async () => 'upstream-only-secret' }))

beforeEach(() => {
  for (const key of Object.keys(environment))
    delete environment[key]
})
afterEach(() => vi.unstubAllGlobals())

describe('local OAuth proxy', () => {
  it('permits only the addon REST and channel authorization operations', () => {
    expect(allowedProxyRequest('GET', '/me')).toBe(true)
    expect(allowedProxyRequest('POST', '/me')).toBe(false)
    expect(allowedProxyRequest('GET', '/speaker/talks')).toBe(false)
    expect(allowedProxyRequest('GET', '/speaker/talks/1')).toBe(true)
    expect(allowedProxyRequest('GET', '/speaker/talks/1/questions/2')).toBe(true)
    expect(allowedProxyRequest('POST', '/speaker/talks/1/run')).toBe(true)
    expect(allowedProxyRequest('POST', '/speaker/talks/1/demo-mode')).toBe(true)
    expect(allowedProxyRequest('DELETE', '/speaker/talks/1/demo-mode')).toBe(true)
    expect(allowedProxyRequest('PUT', '/speaker/talks/1/demo-mode')).toBe(false)
    expect(allowedProxyRequest('DELETE', '/speaker/talks/1/run')).toBe(false)
    for (const path of ['/speaker/talks/0/demo-mode', '/speaker/talks/1/demo-mode?x=y', '/speaker/talks/1/demo-mode/extra']) {
      expect(allowedProxyRequest('POST', path)).toBe(false)
      expect(allowedProxyRequest('DELETE', path)).toBe(false)
    }
    expect(allowedProxyRequest('POST', '/broadcasting/auth')).toBe(true)
    for (const path of ['/logout', '/front/profile', '/speaker/talks/1?x=y', '/speaker/talks/1/../2', '//attacker.example', '/speaker/talks/1/demo-mode'])
      expect(allowedProxyRequest('GET', path)).toBe(false)
    expect(allowedProxyRequest('DELETE', '/speaker/talks/1')).toBe(false)
  })

  it('rejects LAN callers, DNS rebinding, cross-origin requests and missing capabilities', () => {
    const request = {
      socket: { remoteAddress: '127.0.0.1' },
      headers: { 'host': 'localhost:3030', 'origin': 'http://localhost:3030', 'x-inalia-session': 'session' },
    }
    expect(isLocalRequest(request, 'session')).toBe(true)
    expect(isLocalRequest(request, 'wrong-session')).toBe(false)
    expect(isLocalRequest({ ...request, socket: { remoteAddress: '192.168.1.10' } }, 'session')).toBe(false)
    expect(isLocalRequest({ ...request, headers: { ...request.headers, host: 'attacker.example' } }, 'session')).toBe(false)
    expect(isLocalRequest({ ...request, headers: { ...request.headers, origin: 'https://attacker.example' } }, 'session')).toBe(false)
  })

  it.each([undefined, '', '   '])('defaults to OAuth without an API key (%s)', (key) => {
    if (key !== undefined)
      environment.VITE_INALIA_API_KEY = key
    const config = inaliaOAuthPlugin().config({}, { command: 'serve', mode: 'development' })
    expect(config.define.__INALIA_OAUTH_MODE__).toBe('true')
    expect(JSON.parse(config.define.__INALIA_OAUTH_SESSION__)).toMatch(/^[a-f0-9]{64}$/)
  })

  it('uses API-token authentication when a key exists, ignoring the obsolete mode setting', () => {
    environment.VITE_INALIA_API_KEY = 'api-secret'
    environment.VITE_INALIA_AUTH = 'oauth'
    const plugin = inaliaOAuthPlugin()
    const config = plugin.config({}, { command: 'serve', mode: 'development' })
    expect(config.define.__INALIA_OAUTH_MODE__).toBe('false')
    expect(config.define.__INALIA_OAUTH_SESSION__).toBe('""')
    expect(config.define).not.toHaveProperty('import.meta.env.VITE_INALIA_API_KEY')
    const use = vi.fn()
    plugin.configureServer({ middlewares: { use } })
    expect(use).not.toHaveBeenCalled()
  })

  it('does not include a session capability or API key in OAuth builds', () => {
    const fetcher = vi.fn()
    vi.stubGlobal('fetch', fetcher)
    const plugin = inaliaOAuthPlugin()
    const config = plugin.config({}, { command: 'build', mode: 'production' })
    expect(config.define.__INALIA_OAUTH_SESSION__).toBe('""')
    expect(config.define['import.meta.env.VITE_INALIA_API_KEY']).toBe('""')
    expect(config.define.__INALIA_OAUTH_MODE__).toBe('true')
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('adds the OAuth token only upstream, never to the browser response', async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => '{"data":{"number":1}}' })
    vi.stubGlobal('fetch', fetcher)
    const plugin = inaliaOAuthPlugin()
    const config = plugin.config({}, { command: 'serve', mode: 'development' })
    const use = vi.fn()
    plugin.configureServer({ middlewares: { use } })
    const middleware = use.mock.calls[0][0]
    const response = { statusCode: 200, setHeader: vi.fn(), end: vi.fn() }
    await middleware({
      method: 'GET',
      url: '/_inalia/api/speaker/talks/1',
      socket: { remoteAddress: '127.0.0.1' },
      headers: { 'host': 'localhost:3030', 'origin': 'http://localhost:3030', 'x-inalia-session': JSON.parse(config.define.__INALIA_OAUTH_SESSION__) },
    }, response, vi.fn())
    expect(fetcher.mock.calls[0][0]).toBe('https://inalia.app/api/slidev/speaker/talks/1')
    expect(fetcher.mock.calls[0][1].headers.Authorization).toBe('Bearer upstream-only-secret')
    expect(response.end).toHaveBeenCalledWith('{"data":{"number":1}}')
    expect(JSON.stringify(response.end.mock.calls)).not.toContain('upstream-only-secret')
  })

  it.each(['POST', 'DELETE'])('forwards %s demo-mode requests with upstream-only authorization', async (method) => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => '' })
    vi.stubGlobal('fetch', fetcher)
    const plugin = inaliaOAuthPlugin()
    const config = plugin.config({}, { command: 'serve', mode: 'development' })
    const use = vi.fn()
    plugin.configureServer({ middlewares: { use } })
    const middleware = use.mock.calls[0][0]
    const response = { statusCode: 200, setHeader: vi.fn(), end: vi.fn() }
    const request = {
      method,
      url: '/_inalia/api/Barbapapazes/talks/1/demo-mode',
      socket: { remoteAddress: '127.0.0.1' },
      headers: { 'host': 'localhost:3030', 'x-inalia-session': JSON.parse(config.define.__INALIA_OAUTH_SESSION__) },
      async* [Symbol.asyncIterator]() {},
    }
    await middleware(request, response, vi.fn())
    expect(fetcher).toHaveBeenCalledWith('https://inalia.app/api/slidev/Barbapapazes/talks/1/demo-mode', expect.objectContaining({
      method,
      headers: expect.objectContaining({ Authorization: 'Bearer upstream-only-secret' }),
      body: undefined,
    }))
    expect(response.statusCode).toBe(200)
    expect(response.end).toHaveBeenCalledWith('')

    fetcher.mockClear()
    await middleware({
      ...request,
      async* [Symbol.asyncIterator]() { yield '{"unexpected":true}' },
    }, response, vi.fn())
    expect(response.statusCode).toBe(400)
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('creates a new local capability for each dev server', () => {
    const first = inaliaOAuthPlugin().config({}, { command: 'serve', mode: 'development' })
    const second = inaliaOAuthPlugin().config({}, { command: 'serve', mode: 'development' })
    expect(JSON.parse(first.define.__INALIA_OAUTH_SESSION__)).toMatch(/^[a-f0-9]{64}$/)
    expect(first.define.__INALIA_OAUTH_SESSION__).not.toBe(second.define.__INALIA_OAUTH_SESSION__)
  })
})
