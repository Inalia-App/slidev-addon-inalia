import type { ChannelAuthorizationCallback } from 'pusher-js'
import { defineAppSetup } from '@slidev/types'
import Echo from 'laravel-echo'
import { ofetch } from 'ofetch'
import Pusher from 'pusher-js'
import { fetchTalk } from '../utils/api'

export default defineAppSetup(async ({ app }) => {
  if (!import.meta.env.VITE_INALIA_API_KEY
    && !import.meta.env.VITE_INALIA_USERNAME
    && !import.meta.env.VITE_INALIA_TALK_NUMBER) {
    console.warn('Inalia running in static mode — real-time features are disabled.')

    // eslint-disable-next-line no-console
    console.info('To enable real-time functionality, add the following env vars to a .env file:')
    // eslint-disable-next-line no-console
    console.info('  VITE_INALIA_API_KEY, VITE_INALIA_USERNAME, VITE_INALIA_TALK_NUMBER')
    // eslint-disable-next-line no-console
    console.info('You can bootstrap configuration with: npx slidev-addon-inalia')

    // eslint-disable-next-line no-console
    console.info('Documentation: https://docs.inalia.app/slidev-addon-inalia')

    return
  }

  window.Pusher = Pusher
  window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY ?? '9b9ehgq0ba2hjomeiuyu',
    wsHost: import.meta.env.VITE_REVERB_HOST ?? 'ws.inalia.app',
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    authorizer: (channel: { name: string }) => {
      return {
        authorize: (socketId: string, callback: ChannelAuthorizationCallback) => {
          ofetch(`${import.meta.env.VITE_INALIA_ENDPOINT ?? 'https://inalia.app'}/api/broadcasting/auth`, {
            method: 'POST',
            body: {
              socket_id: socketId,
              channel_name: channel.name,
            },
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_INALIA_API_KEY}`,
            },
            onResponse: ({ response }) => {
              callback(null, response._data)
            },
            onRequestError: ({ error }) => {
              callback(error, null)
            },
          })
        },
      }
    },
  })

  app.provide('talk', await fetchTalk())
})
