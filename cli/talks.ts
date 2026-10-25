import { ofetch } from 'ofetch'

export interface Talk {
  number: string | number
  title: string
  scheduled_at?: string
}

const trailingSlash = /\/$/

export async function fetchUsername(endpoint: string, apiKey: string): Promise<string> {
  const url = new URL(`${endpoint.replace(trailingSlash, '')}/api/me`)
  if (!['http:', 'https:'].includes(url.protocol))
    throw new Error('VITE_INALIA_ENDPOINT must be an HTTP(S) server origin.')
  const response = await ofetch(url.href, {
    headers: { Authorization: `Bearer ${apiKey.trim()}`, Accept: 'application/json' },
    timeout: 15000,
    retry: 0,
    redirect: 'error',
  }).catch(() => {
    throw new Error('Could not discover the Inalia account. Check the endpoint and API token.')
  })
  const username = response?.data?.username
  if (typeof username !== 'string' || !username.trim())
    throw new Error('Inalia account discovery failed: username is missing.')
  return username
}

export async function listTalks(endpoint: string, username: string, apiKey: string): Promise<Talk[]> {
  const url = new URL(`${endpoint.replace(trailingSlash, '')}/api/${encodeURIComponent(username.trim())}/talks`)
  if (!['http:', 'https:'].includes(url.protocol))
    throw new Error('VITE_INALIA_ENDPOINT must be an HTTP(S) server origin.')
  const response = await ofetch(url.href, {
    headers: { Authorization: `Bearer ${apiKey.trim()}`, Accept: 'application/json' },
    timeout: 15000,
    retry: 0,
    redirect: 'error',
  }).catch(() => {
    throw new Error('Could not list talks. Check the endpoint, username, token read permission, and account access.')
  })
  if (!Array.isArray(response?.data) || response.data.some((talk: Talk | null) => !talk || talk.number == null || typeof talk.title !== 'string'))
    throw new Error('Unexpected talk list response. Check your Inalia server version.')
  return response.data
}
