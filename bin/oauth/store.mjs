import { createHash, randomBytes } from 'node:crypto'
import { chmod, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'

export function normalizeEndpoint(value = 'https://inalia.app') {
  const url = new URL(value)
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback))
    || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('Inalia endpoint must be an HTTPS origin (HTTP is allowed only on loopback).')
  }
  return url.origin
}

export function credentialPath(endpoint) {
  const key = createHash('sha256').update(normalizeEndpoint(endpoint)).digest('hex')
  return join(process.env.XDG_CONFIG_HOME || join(homedir(), '.config'), 'inalia', 'slidev', `${key}.json`)
}

export async function readCredentials(endpoint) {
  try {
    const data = JSON.parse(await readFile(credentialPath(endpoint), 'utf8'))
    if (data.endpoint !== normalizeEndpoint(endpoint) || !data.client_id || !data.access_token || !data.refresh_token)
      throw new Error('Invalid credentials')
    return data
  }
  catch (error) {
    if (error.code === 'ENOENT')
      throw new Error('Sign in first with: npx slidev-addon-inalia login')
    throw new Error('Cannot read Inalia credentials. Sign in again with: npx slidev-addon-inalia login')
  }
}

export async function saveCredentials(endpoint, data) {
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

export async function deleteCredentials(endpoint) {
  await rm(credentialPath(endpoint), { force: true })
}
