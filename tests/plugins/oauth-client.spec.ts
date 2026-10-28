// @vitest-environment node
import { mkdtemp, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { accessToken, trustedUrl } from '../../plugins/oauth/client'
import { credentialPath, normalizeEndpoint, readCredentials, saveCredentials } from '../../plugins/oauth/store'

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

async function credentials(expiresAt = Date.now() + 3600000, scopes = ['slidev:read']) {
  await saveCredentials(endpoint, {
    client_id: 'client',
    access_token: 'access',
    refresh_token: 'refresh',
    token_endpoint: `${endpoint}/token`,
    expires_at: expiresAt,
    scopes,
  })
}

function tokenResponse(scope = 'slidev:read') {
  return { ok: true, json: async () => ({
    access_token: 'new-access',
    refresh_token: 'new-refresh',
    token_type: 'Bearer',
    expires_in: 3600,
    scope,
  }) }
}

describe('addon OAuth credentials', () => {
  it('defaults to the hosted API origin', () => {
    expect(normalizeEndpoint()).toBe('https://api.inalia.app')
  })

  it('rejects insecure origins and OAuth endpoint substitution', () => {
    for (const value of ['http://inalia.example', 'https://user:secret@inalia.example', 'https://inalia.example/path', 'https://inalia.example/?query=1'])
      expect(() => normalizeEndpoint(value)).toThrow()
    expect(normalizeEndpoint('http://127.0.0.1:8000')).toBe('http://127.0.0.1:8000')
    expect(() => trustedUrl('https://attacker.example/token', endpoint)).toThrow()
  })

  it('stores credentials privately outside the deck and separates origins', async () => {
    await credentials()
    expect(credentialPath(endpoint)).toContain(directory)
    expect((await stat(credentialPath(endpoint))).mode & 0o777).toBe(0o600)
    expect((await readCredentials(endpoint)).access_token).toBe('access')
    await expect(readCredentials('https://other.example')).rejects.toThrow('npx inalia auth login')
  })

  it('rejects incomplete stored credentials with sign-in guidance', async () => {
    await credentials()
    await writeFile(credentialPath(endpoint), JSON.stringify({ endpoint, client_id: 'client' }))
    await expect(readCredentials(endpoint)).rejects.toThrow('npx inalia auth login')
  })

  it('uses unexpired credentials without a network request', async () => {
    await credentials()
    const fetcher = vi.fn()
    vi.stubGlobal('fetch', fetcher)
    expect(await accessToken(endpoint)).toBe('access')
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('refreshes expired credentials once across concurrent requests and persists rotation', async () => {
    await credentials(0)
    const fetcher = vi.fn().mockResolvedValue(tokenResponse())
    vi.stubGlobal('fetch', fetcher)
    expect(await Promise.all([accessToken(endpoint), accessToken(endpoint)])).toEqual(['new-access', 'new-access'])
    expect(fetcher).toHaveBeenCalledTimes(1)
    expect((await readCredentials(endpoint)).refresh_token).toBe('new-refresh')
  })

  it('does not silently downgrade permissions on refresh', async () => {
    await credentials(0, ['slidev:read', 'slidev:present'])
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(tokenResponse()))
    await expect(accessToken(endpoint)).rejects.toThrow('permissions')
    expect((await readCredentials(endpoint)).access_token).toBe('access')
  })

  it('does not send credentials to a substituted token endpoint', async () => {
    await credentials(0)
    const stored = await readCredentials(endpoint)
    await saveCredentials(endpoint, { ...stored, token_endpoint: 'https://attacker.example/token' })
    const fetcher = vi.fn()
    vi.stubGlobal('fetch', fetcher)
    await expect(accessToken(endpoint)).rejects.toThrow('configured Inalia origin')
    expect(fetcher).not.toHaveBeenCalled()
  })
})
