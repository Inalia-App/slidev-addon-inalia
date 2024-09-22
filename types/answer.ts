import type { QuestionType } from './question'

export interface Answer<T extends QuestionType> {
  value: T extends 'text'
    ? string : T extends 'single_select'
      ? {
          label: string
          value: string
        } : any
}

export type StaticAnswer<T extends QuestionType> =
  T extends 'text'
    ? string : T extends 'single_select'
      ? {
          label: string
          value: string
        } : any
