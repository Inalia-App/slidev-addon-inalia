import type { IncomingMessage } from 'node:http'
import type { ConfigEnv, Plugin, UserConfig, ViteDevServer } from 'vite'
import { Buffer } from 'node:buffer'
import { randomBytes } from 'node:crypto'
import process from 'node:process'
import { loadEnv } from 'vite'
import { accessToken } from './oauth/client'
import { normalizeEndpoint } from './oauth/store'

const PREFIX = '/_inalia/api'
const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1'])

const talkPath = '/[\\w-]+/talks/[1-9]\\d*'
const readPath = new RegExp(`^${talkPath}(?:/questions/[1-9]\\d*)?$`)
const runPath = new RegExp(`^${talkPath}/run$`)
const demoModePath = new RegExp(`^${talkPath}/demo-mode$`)
const socketId = /^\d+\.\d+$/
const channelName = /^private-(?:talks\.\d+|questions\.\d+\.answers)$/

type LocalRequest = Pick<IncomingMessage, 'headers'> & { socket: { remoteAddress?: string } }

export function allowedProxyRequest(method: string | undefined, path: string): boolean {
  if (method === 'GET' && path === '/me')
    return true
  if (method === 'POST' && path === '/broadcasting/auth')
    return true
  return (method === 'GET' && readPath.test(path))
    || (method === 'POST' && runPath.test(path))
    || ((method === 'POST' || method === 'DELETE') && demoModePath.test(path))
}

export function isLocalRequest(request: LocalRequest, session: string): boolean {
  if (!LOOPBACK.has(request.socket.remoteAddress || '')
    || request.headers['x-inalia-session'] !== session) {
    return false
  }
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

async function bodyOf(request: IncomingMessage): Promise<string> {
  let body = ''
  for await (const chunk of request) {
    body += chunk
    if (Buffer.byteLength(body) > 4096)
      throw new Error('Request too large')
  }
  return body
}

interface OAuthPlugin extends Plugin {
  config: (config: UserConfig, env: ConfigEnv) => { define: Record<string, string> }
  configureServer: (server: ViteDevServer) => void
}

export function inaliaOAuthPlugin(): OAuthPlugin {
  let endpoint = 'https://api.inalia.app'
  let enabled = false
  let session = ''
  return {
    name: 'inalia:oauth',
    config(config, { command, mode }) {
      const env = loadEnv(mode, config.root || process.cwd(), '')
      enabled = !env.VITE_INALIA_API_KEY?.trim()
      session = enabled && command === 'serve' ? randomBytes(32).toString('hex') : ''
      if (enabled)
        endpoint = normalizeEndpoint(env.VITE_INALIA_ENDPOINT || undefined)
      return {
        define: {
          __INALIA_OAUTH_SESSION__: JSON.stringify(session),
          __INALIA_OAUTH_MODE__: JSON.stringify(enabled),
          // OAuth builds never expose an API key.
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
        const fail = (status: number, message: string): void => {
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
          let body: string | undefined
          if (request.method === 'POST' || request.method === 'DELETE') {
            const raw = await bodyOf(request)
            if (path === '/broadcasting/auth') {
              const data = JSON.parse(raw) as { socket_id?: unknown, channel_name?: unknown } | null
              if (!data || typeof data.socket_id !== 'string' || typeof data.channel_name !== 'string'
                || !socketId.test(data.socket_id) || !channelName.test(data.channel_name)) {
                return fail(400, 'Invalid channel authorization request.')
              }
              body = JSON.stringify({ socket_id: data.socket_id, channel_name: data.channel_name })
            }
            else if (raw && raw !== '{}') {
              return fail(400, 'Unexpected request body.')
            }
          }
          const token = await accessToken(endpoint)
          const upstream = await fetch(`${endpoint}/api/slidev${path}`, {
            method: request.method,
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body,
            redirect: 'error',
            signal: AbortSignal.timeout(15000),
          })
          if (!upstream.ok)
            return fail(upstream.status, upstream.status === 401 ? 'Inalia authorization expired or was revoked. Run npx inalia auth login again.' : 'Inalia denied the request. Check your permissions and talk ownership.')
          response.statusCode = upstream.status
          response.end(await upstream.text())
        }
        catch {
          fail(503, 'Cannot reach Inalia or refresh authorization. Run npx inalia auth login and try again.')
        }
      })
    },
  }
}
