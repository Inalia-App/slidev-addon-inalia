import type { Answer } from '../../types/lite/answer'
import type { Question } from '../../types/lite/question'
import { ofetch } from 'ofetch'
import { INALIA_LITE_TOKEN, INALIA_LITE_TALK_ID, INALIA_LITE_URL } from './constants'

export const api = ofetch.create({
  baseURL: `${INALIA_LITE_URL}/api`,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${INALIA_LITE_TOKEN}`,
  },
})

export async function fetchQuestion(questionId: number): Promise<Question> {
  return api<Question>(`/talks/${INALIA_LITE_TALK_ID}/questions/${questionId}`)
}

export async function fetchAnswers(questionId: number): Promise<{ data: Answer[] }> {
  return api<{ data: Answer[] }>(`/talks/${INALIA_LITE_TALK_ID}/questions/${questionId}/answers`)
}
