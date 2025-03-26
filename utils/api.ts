import { ofetch } from 'ofetch'

export const api = ofetch.create({
  baseURL: import.meta.env.VITE_INALIA_ENDPOINT,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_INALIA_API_KEY}`,
  },
})
