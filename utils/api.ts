import type { Question } from '../types/question'
import type { Talk } from '../types/talk'
import { ofetch } from 'ofetch'

export const api = ofetch.create({
  baseURL: import.meta.env.VITE_INALIA_ENDPOINT ?? 'https://inalia.app',
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_INALIA_API_KEY}`,
  },
})

export async function fetchTalk(): Promise<Talk> {
  return api<{ data: Talk }>(`/api/${import.meta.env.VITE_INALIA_USERNAME}/talks/${import.meta.env.VITE_INALIA_TALK_NUMBER}`).then(response => response.data)
}

export async function runTalk(): Promise<void> {
  return api(`/api/${import.meta.env.VITE_INALIA_USERNAME}/talks/${import.meta.env.VITE_INALIA_TALK_NUMBER}/run`, {
    method: 'POST',
  }).then(response => response.data)
}

export async function fetchQuestion(questionNumber: number): Promise<Question> {
  return api<{ data: Question }>(`/api/${import.meta.env.VITE_INALIA_USERNAME}/talks/${import.meta.env.VITE_INALIA_TALK_NUMBER}/questions/${questionNumber}`).then(response => response.data)
}
