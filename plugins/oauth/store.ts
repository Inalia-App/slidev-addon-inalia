import { createHash, randomBytes } from 'node:crypto'
import { chmod, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'

export interface Credentials {
  client_id: string
  token_endpoint: string
  access_token: string
  refresh_token: string
  expires_at: number
  scopes: string[]
}

export interface StoredCredentials extends Credentials {
  endpoint: string
}

export function normalizeEndpoint(value = 'https://api.inalia.app'): string {
  const url = new URL(value)
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback))
    || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('Inalia endpoint must be an HTTPS origin (HTTP is allowed only on loopback).')
  }
  return url.origin
}

export function credentialPath(endpoint: string): string {
  const key = createHash('sha256').update(normalizeEndpoint(endpoint)).digest('hex')
  return join(process.env.XDG_CONFIG_HOME || join(homedir(), '.config'), 'inalia', 'slidev', `${key}.json`)
}

export async function readCredentials(endpoint: string): Promise<StoredCredentials> {
  try {
    const data = JSON.parse(await readFile(credentialPath(endpoint), 'utf8')) as Partial<StoredCredentials> | null
    if (!data || data.endpoint !== normalizeEndpoint(endpoint)
      || typeof data.client_id !== 'string' || !data.client_id
      || typeof data.access_token !== 'string' || !data.access_token
      || typeof data.refresh_token !== 'string' || !data.refresh_token
      || typeof data.token_endpoint !== 'string' || !data.token_endpoint
      || typeof data.expires_at !== 'number' || !Number.isFinite(data.expires_at)
      || !Array.isArray(data.scopes) || !data.scopes.every(scope => typeof scope === 'string')) {
      throw new Error('Invalid credentials')
    }
    return data as StoredCredentials
  }
  catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT')
      throw new Error('Sign in first with: npx inalia auth login')
    throw new Error('Cannot read Inalia credentials. Sign in again with: npx inalia auth login')
  }
}

export async function saveCredentials(endpoint: string, data: Credentials): Promise<void> {
  const path = credentialPath(endpoint)
  const directory = join(path, '..')
  await mkdir(directory, { recursive: true, mode: 0o700 })
  await chmod(directory, 0o700)
  const temporary = `${path}.${randomBytes(12).toString('hex')}.tmp`
  try {
    await writeFile(temporary, JSON.stringify({ ...data, endpoint: normalizeEndpoint(endpoint) }), { mode: 0o600, flag: 'wx' })
    await rename(temporary, path)
    await chmod(path, 0o600)
  }
  finally {
    await rm(temporary, { force: true })
  }
}
