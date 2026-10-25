import { ofetch } from 'ofetch'

export async function listTalks(endpoint, username, apiKey) {
  const url = new URL(`${endpoint.replace(/\/$/, '')}/api/${encodeURIComponent(username.trim())}/talks`)
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
  if (!Array.isArray(response?.data) || response.data.some(talk => !talk || talk.number == null || typeof talk.title !== 'string'))
    throw new Error('Unexpected talk list response. Check your Inalia server version.')
  return response.data
}
