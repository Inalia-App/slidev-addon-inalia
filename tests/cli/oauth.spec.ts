// @vitest-environment node
import { get } from 'node:http'
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accessToken, login, logout, pkceChallenge, trustedUrl } from '../../bin/oauth/client.mjs'
import { credentialPath, normalizeEndpoint, readCredentials, saveCredentials } from '../../bin/oauth/store.mjs'

const endpoint = 'https://inalia.example'
let directory: string

beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), 'inalia-oauth-'))
  vi.stubEnv('XDG_CONFIG_HOME', directory)
})

afterEach(async () => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  await rm(directory, { recursive: true, force: true })
})

function json(data: unknown) {
  return { ok: true, status: 200, json: async () => data }
}

function callbackRequest(url: URL) {
  get(url, response => response.resume()).on('error', () => {})
}

describe('OAuth client', () => {
  it('uses the RFC 7636 S256 challenge', () => {
    expect(pkceChallenge('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'))
      .toBe('E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM')
  })

  it('rejects insecure origins and OAuth endpoint substitution', () => {
    for (const value of ['http://inalia.example', 'https://user:secret@inalia.example', 'https://inalia.example/path', 'https://inalia.example/?query=1'])
      expect(() => normalizeEndpoint(value)).toThrow()
    expect(normalizeEndpoint('http://127.0.0.1:8000')).toBe('http://127.0.0.1:8000')
    expect(() => trustedUrl('https://attacker.example/token', endpoint)).toThrow()
  })

  it('stores credentials privately outside the deck and separates origins', async () => {
    await saveCredentials(endpoint, { client_id: 'client', access_token: 'access', refresh_token: 'refresh' })
    expect(credentialPath(endpoint)).toContain(directory)
    expect((await stat(credentialPath(endpoint))).mode & 0o777).toBe(0o600)
    expect((await readCredentials(endpoint)).access_token).toBe('access')
    await expect(readCredentials('https://other.example')).rejects.toThrow('Sign in first')
  })

  it('completes public-client PKCE login without storing the verifier or a client secret', async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(json({
        issuer: endpoint, authorization_endpoint: `${endpoint}/authorize`,
        token_endpoint: `${endpoint}/token`, registration_endpoint: `${endpoint}/register`,
        code_challenge_methods_supported: ['S256'],
      }))
      .mockResolvedValueOnce(json({ client_id: 'public-client', token_endpoint_auth_method: 'none' }))
      .mockResolvedValueOnce(json({
        access_token: 'access', refresh_token: 'refresh', token_type: 'Bearer',
        expires_in: 3600, scope: 'slidev:read slidev:present',
      }))
    vi.stubGlobal('fetch', fetcher)
    let authorization: URL
    await login({ endpoint, open: false, onUrl: (message: string) => {
      authorization = new URL(message.split('\n')[1])
      const callback = new URL(authorization.searchParams.get('redirect_uri')!)
      callback.searchParams.set('state', authorization.searchParams.get('state')!)
      callback.searchParams.set('code', 'approved-code')
      const invalid = new URL(callback)
      invalid.searchParams.set('state', 'wrong-state')
      get(invalid, (response) => {
        expect(response.statusCode).toBe(400)
        response.resume()
        response.once('end', () => callbackRequest(callback))
      }).on('error', () => {})
    } })
    expect(authorization!.searchParams.get('code_challenge_method')).toBe('S256')
    expect(authorization!.searchParams.get('scope')).toBe('slidev:read slidev:present')
    const exchange = fetcher.mock.calls[2][1].body as URLSearchParams
    expect(exchange.get('client_secret')).toBeNull()
    expect(pkceChallenge(exchange.get('code_verifier'))).toBe(authorization!.searchParams.get('code_challenge'))
    const stored = await readFile(credentialPath(endpoint), 'utf8')
    expect(stored).not.toContain('code_verifier')
    expect(stored).not.toContain('client_secret')
  })

  it('reports denied consent without saving credentials', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(json({
        issuer: endpoint, authorization_endpoint: `${endpoint}/authorize`,
        token_endpoint: `${endpoint}/token`, registration_endpoint: `${endpoint}/register`,
        code_challenge_methods_supported: ['S256'],
      }))
      .mockResolvedValueOnce(json({ client_id: 'public-client', token_endpoint_auth_method: 'none' })))
    await expect(login({ endpoint, open: false, onUrl: (message: string) => {
      const authorization = new URL(message.split('\n')[1])
      const callback = new URL(authorization.searchParams.get('redirect_uri')!)
      callback.searchParams.set('state', authorization.searchParams.get('state')!)
      callback.searchParams.set('error', 'access_denied')
      callbackRequest(callback)
    } })).rejects.toThrow('denied')
    await expect(readCredentials(endpoint)).rejects.toThrow('Sign in first')
  })

  it('refreshes expired credentials once across concurrent requests and persists rotation', async () => {
    await saveCredentials(endpoint, {
      client_id: 'client', access_token: 'expired', refresh_token: 'old-refresh',
      token_endpoint: `${endpoint}/token`, expires_at: 0, scopes: ['slidev:read'],
    })
    const fetcher = vi.fn().mockResolvedValue(json({
      access_token: 'new-access', refresh_token: 'new-refresh', token_type: 'Bearer',
      expires_in: 3600, scope: 'slidev:read',
    }))
    vi.stubGlobal('fetch', fetcher)
    expect(await Promise.all([accessToken(endpoint), accessToken(endpoint)])).toEqual(['new-access', 'new-access'])
    expect(fetcher).toHaveBeenCalledTimes(1)
    expect((await readCredentials(endpoint)).refresh_token).toBe('new-refresh')
  })

  it.each([true, false])('removes local credentials after logout, even when remote revocation succeeds=%s', async (ok) => {
    await saveCredentials(endpoint, {
      client_id: 'client', access_token: 'access', refresh_token: 'refresh',
      token_endpoint: `${endpoint}/token`, expires_at: Date.now() + 3600000, scopes: ['slidev:read'],
    })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok }))
    if (ok)
      await logout(endpoint)
    else
      await expect(logout(endpoint)).rejects.toThrow('Local credentials were removed')
    await expect(readCredentials(endpoint)).rejects.toThrow('Sign in first')
  })

  it('does not silently downgrade permissions on refresh', async () => {
    await saveCredentials(endpoint, {
      client_id: 'client', access_token: 'expired', refresh_token: 'refresh',
      token_endpoint: `${endpoint}/token`, expires_at: 0, scopes: ['slidev:read', 'slidev:present'],
    })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({
      access_token: 'new-access', refresh_token: 'new-refresh', token_type: 'Bearer',
      expires_in: 3600, scope: 'slidev:read',
    })))
    await expect(accessToken(endpoint)).rejects.toThrow('permissions')
    expect((await readCredentials(endpoint)).access_token).toBe('expired')
  })
})
