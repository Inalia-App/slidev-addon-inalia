import type { Credentials } from './store'
import { mkdir, rm, stat } from 'node:fs/promises'
import { dirname } from 'node:path'
import { credentialPath, normalizeEndpoint, readCredentials, saveCredentials } from './store'

// Keep the credential format and refresh locking in sync with the inalia CLI.
interface TokenResponse {
  access_token?: unknown
  refresh_token?: unknown
  token_type?: unknown
  expires_in?: unknown
  scope?: unknown
}

type TokenData = Pick<Credentials, 'access_token' | 'refresh_token' | 'expires_at' | 'scopes'>

export function trustedUrl(value: string, endpoint: string): string {
  const url = new URL(value)
  if (url.origin !== normalizeEndpoint(endpoint) || url.username || url.password || url.hash)
    throw new Error('OAuth endpoint must belong to the configured Inalia origin.')
  return url.href
}

async function jsonRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { Accept: 'application/json', ...options.headers },
    redirect: 'error',
    signal: AbortSignal.timeout(15000),
  })
  if (!response.ok)
    throw new Error(`Inalia authentication failed (HTTP ${response.status}). Sign in again if access was revoked.`)
  return response.json() as Promise<T>
}

function tokenData(data: TokenResponse, requiredScopes: string[]): TokenData {
  const scopes = typeof data.scope === 'string' ? data.scope.split(' ') : []
  if (typeof data.access_token !== 'string' || !data.access_token
    || typeof data.refresh_token !== 'string' || !data.refresh_token
    || typeof data.token_type !== 'string' || data.token_type.toLowerCase() !== 'bearer'
    || typeof data.expires_in !== 'number' || !Number.isFinite(data.expires_in) || data.expires_in <= 0
    || !requiredScopes.every(scope => scopes.includes(scope))) {
    throw new Error('Inalia did not grant the requested Slidev permissions.')
  }
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
    scopes,
  }
}

// Serialize refreshes across Slidev and CLI processes because refresh tokens rotate.
async function withCredentialLock<T>(endpoint: string, action: () => Promise<T>): Promise<T> {
  const lock = `${credentialPath(endpoint)}.lock`
  await mkdir(dirname(lock), { recursive: true, mode: 0o700 })
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      await mkdir(lock, { mode: 0o700 })
    }
    catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'EEXIST'))
        throw error
      const info = await stat(lock).catch(() => null)
      if (info && Date.now() - info.mtimeMs > 60000)
        await rm(lock, { recursive: true, force: true })
      await new Promise(resolve => setTimeout(resolve, 200))
      continue
    }
    try {
      return await action()
    }
    finally {
      await rm(lock, { recursive: true, force: true })
    }
  }
  throw new Error('Inalia credentials are busy. Try again shortly.')
}

export async function accessToken(endpoint: string): Promise<string> {
  endpoint = normalizeEndpoint(endpoint)
  const credentials = await readCredentials(endpoint)
  if (credentials.expires_at > Date.now() + 60000)
    return credentials.access_token
  return withCredentialLock(endpoint, async () => {
    const current = await readCredentials(endpoint)
    if (current.expires_at > Date.now() + 60000)
      return current.access_token
    const data = await jsonRequest<TokenResponse>(trustedUrl(current.token_endpoint, endpoint), {
      method: 'POST',
      body: new URLSearchParams({ grant_type: 'refresh_token', client_id: current.client_id, refresh_token: current.refresh_token }),
    })
    const updated = { ...current, ...tokenData(data, current.scopes) }
    await saveCredentials(endpoint, updated)
    return updated.access_token
  })
}
