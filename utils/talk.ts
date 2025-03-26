import type { Talk } from '../types'
import { api } from './api'

export async function fetchTalk(): Promise<Talk> {
  return api<{ data: Talk }>(`/api/${import.meta.env.VITE_INALIA_USERNAME}/talks/${import.meta.env.VITE_INALIA_TALK_ID}`, {}).then(response => response.data)
}
