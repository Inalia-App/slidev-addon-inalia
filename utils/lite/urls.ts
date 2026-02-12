export function createTalkOverviewUrl(): string {
  return `${import.meta.env.VITE_INALIA_LITE_URL ?? 'https://lite.inalia.app'}/presentation/${import.meta.env.VITE_INALIA_LITE_TALK_ID}/overview`
}

export function createAnswersCreateUrl(questionId: number): string {
  return `${import.meta.env.VITE_INALIA_LITE_URL ?? 'https://lite.inalia.app'}/presentation/${import.meta.env.VITE_INALIA_LITE_TALK_ID}/questions/${questionId}/answers/create`
}
