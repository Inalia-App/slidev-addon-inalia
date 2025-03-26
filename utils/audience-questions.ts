import type { AudienceQuestion } from '../types/audience-question'
import { api } from './api'

export async function fetchAudienceQuestions(): Promise<AudienceQuestion[]> {
  return api<AudienceQuestion[]>(`/api/${import.meta.env.VITE_INALIA_USERNAME}/talks/${import.meta.env.VITE_INALIA_TALK_ID}/audience-questions`, {})
}
