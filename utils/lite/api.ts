import type { Answer } from '../../types/lite/answer'
import type { Question } from '../../types/lite/question'
import { ofetch } from 'ofetch'

export const api = ofetch.create({
  baseURL: `${import.meta.env.VITE_INALIA_LITE_URL ?? 'https://lite.inalia.app'}/api`,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_INALIA_LITE_KEY}`,
  },
})

export async function fetchQuestion(questionId: number): Promise<Question> {
  return api<Question>(`/talks/${import.meta.env.VITE_INALIA_LITE_TALK_ID}/questions/${questionId}`)
}

export async function fetchAnswers(questionId: number): Promise<{ data: Answer[] }> {
  return api<{ data: Answer[] }>(`/talks/${import.meta.env.VITE_INALIA_LITE_TALK_ID}/questions/${questionId}/answers`)
}
