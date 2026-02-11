import type { ChannelAuthorizationCallback } from 'pusher-js'
import { defineAppSetup } from '@slidev/types'
import Echo from 'laravel-echo'
import { ofetch } from 'ofetch'
import Pusher from 'pusher-js'
import { fetchTalk } from '../utils/api'
import { isStaticEnabled as isLiteStaticEnabled } from '../utils/lite/static'
import { isStaticEnabled } from '../utils/static'

export default defineAppSetup(async ({ app }) => {
  if (!isStaticEnabled) {
    // eslint-disable-next-line no-console
    console.info('Inalia is active. Connecting to a talk...')

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
  }
  else if (isLiteStaticEnabled) {
    // eslint-disable-next-line no-console
    console.info('Inalia Lite is active. Connecting to a talk...')
  }
  else {
    console.warn('Inalia is running in static mode.')
    // eslint-disable-next-line no-console
    console.info('Documentation: https://docs.inalia.app/slidev-addon-inalia')
  }
})
