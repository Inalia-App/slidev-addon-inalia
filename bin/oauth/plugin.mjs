import { randomBytes } from 'node:crypto'
import process from 'node:process'
import { loadEnv } from 'vite'
import { accessToken } from './client.mjs'
import { normalizeEndpoint } from './store.mjs'

const PREFIX = '/_inalia/api'
const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1'])

export function allowedProxyRequest(method, path) {
  if (method === 'POST' && path === '/broadcasting/auth')
    return true
  const talk = '/[a-zA-Z0-9_-]+/talks/[1-9][0-9]*'
  return (method === 'GET' && new RegExp(`^${talk}(?:/questions/[1-9][0-9]*)?$`).test(path))
    || (method === 'POST' && new RegExp(`^${talk}/run$`).test(path))
}

export function isLocalRequest(request, session) {
  if (!LOOPBACK.has(request.socket.remoteAddress)
    || request.headers['x-inalia-session'] !== session)
    return false
  try {
    const host = new URL(`http://${request.headers.host}`)
    if (!['localhost', '127.0.0.1', '[::1]'].includes(host.hostname))
      return false
    if (request.headers.origin) {
      const origin = new URL(request.headers.origin)
      if (!['http:', 'https:'].includes(origin.protocol) || origin.host !== host.host)
        return false
    }
    return true
  }
  catch {
    return false
  }
}

async function bodyOf(request) {
  let body = ''
  for await (const chunk of request) {
    body += chunk
    if (Buffer.byteLength(body) > 4096)
      throw new Error('Request too large')
  }
  return body
}

export function inaliaOAuthPlugin() {
  let endpoint
  let enabled = false
  let session = ''
  return {
    name: 'inalia:oauth',
    config(config, { command, mode }) {
      const env = loadEnv(mode, config.root || process.cwd(), '')
      enabled = env.VITE_INALIA_AUTH === 'oauth'
      session = enabled && command === 'serve' ? randomBytes(32).toString('hex') : ''
      if (enabled)
        endpoint = normalizeEndpoint(env.VITE_INALIA_ENDPOINT || 'https://inalia.app')
      return {
        define: {
          __INALIA_OAUTH_SESSION__: JSON.stringify(session),
          __INALIA_OAUTH_MODE__: JSON.stringify(enabled),
          // Even an old API key left in .env must not enter an OAuth build.
          ...(enabled ? { 'import.meta.env.VITE_INALIA_API_KEY': JSON.stringify('') } : {}),
        },
      }
    },
    configureServer(server) {
      if (!enabled)
        return
      server.middlewares.use(async (request, response, next) => {
        if (!request.url?.startsWith('/_inalia/'))
          return next()
        response.setHeader('Cache-Control', 'no-store')
        response.setHeader('Content-Type', 'application/json')
        const fail = (status, message) => {
          response.statusCode = status
          response.end(JSON.stringify({ message }))
        }
        // No CORS, OPTIONS, LAN clients, arbitrary upstreams or caller headers.
        if (!isLocalRequest(request, session))
          return fail(403, 'Inalia OAuth is available only from a local Slidev browser.')
        const path = request.url.startsWith(PREFIX) ? request.url.slice(PREFIX.length) : ''
        if (!allowedProxyRequest(request.method, path))
          return fail(404, 'Unsupported Inalia request.')
        try {
          let body
          if (request.method === 'POST') {
            const raw = await bodyOf(request)
            if (path === '/broadcasting/auth') {
              const data = JSON.parse(raw)
              if (!/^\d+\.\d+$/.test(data.socket_id) || !/^private-(?:talks\.\d+|questions\.\d+\.answers)$/.test(data.channel_name))
                return fail(400, 'Invalid channel authorization request.')
              body = JSON.stringify({ socket_id: data.socket_id, channel_name: data.channel_name })
            }
            else if (raw && raw !== '{}') {
              return fail(400, 'Unexpected request body.')
            }
          }
          const token = await accessToken(endpoint)
          const upstream = await fetch(`${endpoint}/api/slidev${path}`, {
            method: request.method,
            headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body, redirect: 'error', signal: AbortSignal.timeout(15000),
          })
          if (!upstream.ok)
            return fail(upstream.status, upstream.status === 401 ? 'Inalia authorization expired or was revoked. Run the login command again.' : 'Inalia denied the request. Check your permissions and talk ownership.')
          response.statusCode = upstream.status
          response.end(await upstream.text())
        }
        catch {
          fail(503, 'Cannot reach Inalia or refresh authorization. Run npx slidev-addon-inalia login and try again.')
        }
      })
    },
  }
}
