import { defineAppSetup } from '@slidev/types'
import Echo from 'laravel-echo'
import { ofetch } from 'ofetch'
import Pusher from 'pusher-js'

/**
 * Setup the Laravel Echo client
 */
export default defineAppSetup(() => {
  window.Pusher = Pusher

  window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    authorizer: (channel: { name: string }) => {
      return {
        authorize: (socketId: string, callback: (success: boolean, data: any) => void) => {
          ofetch(`${import.meta.env.VITE_INALIA_ENDPOINT}/api/broadcasting/auth`, {
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
              callback(false, response._data)
            },
            onRequestError: ({ error }) => {
              callback(true, error)
            },
          })
        },
      }
    },
  })
})
