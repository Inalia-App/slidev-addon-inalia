import type { FeedbackReaction } from '../types/feedback-reaction'
import { api } from './api'

export async function fetchFeedbackReactions(): Promise<FeedbackReaction[]> {
  return api<FeedbackReaction[]>(`/api/${import.meta.env.VITE_INALIA_USERNAME}/talks/${import.meta.env.VITE_INALIA_TALK_ID}/feedback-reactions`, {})
}
