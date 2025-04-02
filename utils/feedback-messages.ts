import type { FeedbackMessage } from '../types/feedback-message'
import { api } from './api'

export async function fetchFeedbackMessages(): Promise<FeedbackMessage[]> {
  return api<FeedbackMessage[]>(`/api/${import.meta.env.VITE_INALIA_USERNAME}/talks/${import.meta.env.VITE_INALIA_TALK_ID}/feedback-messages`, {})
}
