import type { QuestionType } from './question'

export type Answer<T extends QuestionType> =
  T extends 'text'
    ? string : T extends 'single_select'
      ? {
          label: string
          value: number
          color: string
        } : any

// eslint-disable-next-line unused-imports/no-unused-vars
export interface AnswerCreated<T extends QuestionType> {}
