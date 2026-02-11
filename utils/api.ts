import type { Question } from '../types/question'
import type { Talk } from '../types/talk'
import { ofetch } from 'ofetch'
import { INALIA_API_KEY, INALIA_ENDPOINT, INALIA_TALK_NUMBER, INALIA_USERNAME } from './constants'

export const api = ofetch.create({
  baseURL: INALIA_ENDPOINT,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${INALIA_API_KEY}`,
  },
})

export async function fetchTalk(): Promise<Talk> {
  return api<{ data: Talk }>(`/api/${INALIA_USERNAME}/talks/${INALIA_TALK_NUMBER}`).then(response => response.data)
}

export async function runTalk(): Promise<void> {
  return api(`/api/${INALIA_USERNAME}/talks/${INALIA_TALK_NUMBER}/run`, {
    method: 'POST',
  }).then(response => response.data)
}

export async function fetchQuestion(questionNumber: number): Promise<Question> {
  return api<{ data: Question }>(`/api/${INALIA_USERNAME}/talks/${INALIA_TALK_NUMBER}/questions/${questionNumber}`).then(response => response.data)
}
