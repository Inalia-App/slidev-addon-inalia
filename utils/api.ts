import type { AudienceQuestion } from '../types/audience-question'
import type { FeedbackMessage } from '../types/feedback-message'
import type { FeedbackReaction } from '../types/feedback-reaction'
import type { Question } from '../types/question'
import type { Talk } from '../types/talk'
import { ofetch } from 'ofetch'

export const api = ofetch.create({
  baseURL: import.meta.env.VITE_INALIA_ENDPOINT,
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_INALIA_API_KEY}`,
  },
})

export async function fetchTalk(): Promise<Talk> {
  return api<{ data: Talk }>(`/api/${import.meta.env.VITE_INALIA_USERNAME}/talks/${import.meta.env.VITE_INALIA_TALK_NUMBER}`).then(response => response.data)
}

export async function fetchQuestion(questionNumber: number): Promise<Question> {
  return api<{ data: Question }>(`/api/${import.meta.env.VITE_INALIA_USERNAME}/talks/${import.meta.env.VITE_INALIA_TALK_NUMBER}/questions/${questionNumber}`).then(response => response.data)
}

export async function fetchAudienceQuestions(): Promise<AudienceQuestion[]> {
  return api<{ data: AudienceQuestion[] }>(`/api/${import.meta.env.VITE_INALIA_USERNAME}/talks/${import.meta.env.VITE_INALIA_TALK_NUMBER}/audience-questions`).then(response => response.data)
}

export async function fetchFeedbackMessages(): Promise<FeedbackMessage[]> {
  return api<{ data: FeedbackMessage[] }>(`/api/${import.meta.env.VITE_INALIA_USERNAME}/talks/${import.meta.env.VITE_INALIA_TALK_NUMBER}/feedback-messages`).then(response => response.data)
}

export async function fetchFeedbackReactions(): Promise<FeedbackReaction[]> {
  return api<{ data: FeedbackReaction[] }>(`/api/${import.meta.env.VITE_INALIA_USERNAME}/talks/${import.meta.env.VITE_INALIA_TALK_NUMBER}/feedback-reactions`, {}).then(response => response.data)
}
