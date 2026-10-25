import type { ChannelAuthorizationCallback } from 'pusher-js'
import { ofetch } from 'ofetch'
import { INALIA_API_KEY, INALIA_ENDPOINT } from './constants'

export async function authorizeChannel(channelName: string, socketId: string, callback: ChannelAuthorizationCallback): Promise<void> {
  let data: Parameters<ChannelAuthorizationCallback>[1]
  try {
    data = await ofetch(`${INALIA_ENDPOINT}/api/broadcasting/auth`, {
      method: 'POST',
      retry: 0,
      body: {
        socket_id: socketId,
        channel_name: channelName,
      },
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${INALIA_API_KEY}`,
      },
    })
  }
  catch (error) {
    callback(error instanceof Error ? error : new Error(String(error)), null)
    return
  }

  callback(null, data)
}
