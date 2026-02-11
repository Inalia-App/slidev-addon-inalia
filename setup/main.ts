import type { ChannelAuthorizationCallback } from 'pusher-js'
import { defineAppSetup } from '@slidev/types'
import Echo from 'laravel-echo'
import { ofetch } from 'ofetch'
import Pusher from 'pusher-js'
import { fetchTalk } from '../utils/api'
import { INALIA_API_KEY, INALIA_ENDPOINT, REVERB_APP_KEY, REVERB_HOST, REVERB_PORT, REVERB_SCHEME } from '../utils/constants'
import { isStaticEnabled as isLiteStaticEnabled } from '../utils/lite/static'
import { isStaticEnabled } from '../utils/static'

export default defineAppSetup(async ({ app }) => {
  if (!isStaticEnabled) {
    // eslint-disable-next-line no-console
    console.info('Inalia is active. Connecting to a talk...')

    window.Pusher = Pusher
    window.Echo = new Echo({
      broadcaster: 'reverb',
      key: REVERB_APP_KEY,
      wsHost: REVERB_HOST,
      wsPort: REVERB_PORT ?? 80,
      wssPort: REVERB_PORT ?? 443,
      forceTLS: REVERB_SCHEME === 'https',
      enabledTransports: ['ws', 'wss'],
      authorizer: (channel: { name: string }) => {
        return {
          authorize: (socketId: string, callback: ChannelAuthorizationCallback) => {
            ofetch(`${INALIA_ENDPOINT}/api/broadcasting/auth`, {
              method: 'POST',
              body: {
                socket_id: socketId,
                channel_name: channel.name,
              },
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${INALIA_API_KEY}`,
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
  else if (!isLiteStaticEnabled) {
    // eslint-disable-next-line no-console
    console.info('Inalia Lite is active. Connecting to a talk...')
  }
  else {
    console.warn('Inalia is running in static mode.')
    // eslint-disable-next-line no-console
    console.info('Documentation: https://docs.inalia.app/slidev-addon-inalia')
  }
})
