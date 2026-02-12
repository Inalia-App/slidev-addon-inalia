export type QuestionType = 'text' | 'single_select'

export interface SingleSelectChoice {
  text: string
  value: string
  color?: string
}

export interface SingleSelectOptions {
  choices: SingleSelectChoice[]
}

export interface BaseQuestion {
  id: number
  label: string
  placeholder: string
  question: string
  type: QuestionType
}

export interface TextQuestion extends BaseQuestion {
  type: 'text'
  options?: undefined
}

export interface SingleSelectQuestion extends BaseQuestion {
  type: 'single_select'
  options: SingleSelectOptions
}

export type Question = TextQuestion | SingleSelectQuestion
