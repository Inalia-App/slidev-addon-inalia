export type QuestionType = 'text' | 'single_select' | 'multi_select'

export interface Question {
  id: number
  question: string
  type: QuestionType
}

export interface StaticQuestion<T extends QuestionType> extends Pick<Question, 'question' | 'type'> {
  type: T
}
