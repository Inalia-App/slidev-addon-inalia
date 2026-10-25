import type { Question } from '../types/question'
import type { Talk } from '../types/talk'
import { ofetch } from 'ofetch'
import { INALIA_API_KEY, INALIA_ENDPOINT, INALIA_TALK_NUMBER } from './constants'

export const api = ofetch.create({
  baseURL: INALIA_ENDPOINT,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${INALIA_API_KEY}`,
  },
})

let usernamePromise: Promise<string> | undefined

async function fetchUsername(): Promise<string> {
  usernamePromise ??= api<{ data: { username: string } }>('/api/me')
    .then(response => response.data.username)
    .catch((error) => {
      usernamePromise = undefined
      throw error
    })
  return usernamePromise
}

export async function fetchTalk(): Promise<Talk> {
  const username = encodeURIComponent(await fetchUsername())
  return api<{ data: Talk }>(`/api/${username}/talks/${INALIA_TALK_NUMBER}`).then(response => response.data)
}

export async function runTalk(): Promise<void> {
  const username = encodeURIComponent(await fetchUsername())
  return api(`/api/${username}/talks/${INALIA_TALK_NUMBER}/run`, {
    method: 'POST',
  }).then(response => response.data)
}

export async function fetchQuestion(questionNumber: number): Promise<Question> {
  const username = encodeURIComponent(await fetchUsername())
  return api<{ data: Question }>(`/api/${username}/talks/${INALIA_TALK_NUMBER}/questions/${questionNumber}`).then(response => response.data)
}
