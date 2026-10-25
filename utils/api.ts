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

export async function fetchUsername(): Promise<string> {
  const response = await api<{ data?: { username?: string | null } }>('/api/me')
  const username = response.data?.username
  if (typeof username !== 'string' || !username.trim())
    throw new Error('Inalia account discovery failed: username is missing.')

  return username
}

function talkPath(username: string): string {
  return `/api/${encodeURIComponent(username)}/talks/${INALIA_TALK_NUMBER}`
}

export async function fetchTalk(username: string): Promise<Talk> {
  return api<{ data: Talk }>(talkPath(username)).then(response => response.data)
}

export async function runTalk(username: string): Promise<void> {
  return api(`${talkPath(username)}/run`, {
    method: 'POST',
  }).then(response => response.data)
}

export async function fetchQuestion(username: string, questionNumber: number): Promise<Question> {
  return api<{ data: Question }>(`${talkPath(username)}/questions/${questionNumber}`).then(response => response.data)
}
