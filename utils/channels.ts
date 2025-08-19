export function talkChannel(talkId: number): string {
  return `talks.${talkId}`
}

export function answersChannel(questionId?: number): string | undefined {
  if (!questionId) {
    return
  }

  return `questions.${questionId}.answers`
}
