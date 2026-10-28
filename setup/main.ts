import type { ChannelAuthorizationCallback } from 'pusher-js'
import { defineAppSetup } from '@slidev/types'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { fetchTalk, fetchUsername } from '../utils/api'
import { authorizeChannel } from '../utils/authorize'
import { INALIA_AUTHENTICATED, INALIA_TALK_NUMBER } from '../utils/constants'

export default defineAppSetup(async ({ app }) => {
  if (!INALIA_AUTHENTICATED || !INALIA_TALK_NUMBER) {
    console.warn('Inalia running in static mode — real-time features are disabled.')

    // eslint-disable-next-line no-console
    console.info('To enable real-time functionality, add the following env vars to a .env file:')
    // eslint-disable-next-line no-console
    console.info('  VITE_INALIA_TALK_NUMBER (OAuth by default), plus VITE_INALIA_API_KEY only for API-token authentication')
    // eslint-disable-next-line no-console
    console.info('Bootstrap with: npx inalia slidev setup. OAuth requires a local Slidev dev server; exports use static data.')

    // eslint-disable-next-line no-console
    console.info('Documentation: https://docs.inalia.app/slidev-addon-inalia')

    return
  }

  const username = await fetchUsername()
  app.provide('username', username)

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
          void authorizeChannel(channel.name, socketId, callback)
        },
      }
    },
  })

  const talk = await fetchTalk(username)
  app.provide('talk', talk)
})
