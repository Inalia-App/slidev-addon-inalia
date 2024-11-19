import type { MultipleSelectAnswer, TextAnswer } from './answer'

interface BaseQuestion {
  tiny_url: string
  id: number
  number: number
  question: string
}

type SingleSelect = 'single_select' | 'radio'
type MultipleSelectSelectionType = 'multi_select' | 'checkbox'

export type ChartType = 'bar' | 'donut'

export type ChartTypeFor<T extends Question> = T extends MultipleSelectQuestion ? ChartType : never

interface Choice { color: string, text: string, value: string }

export type TextQuestion = BaseQuestion & {
  type: 'text'
  options: { label: string, placeholder: string }
  answers: TextAnswer[]
}

export type SingleSelectQuestion = BaseQuestion & {
  type: 'single_select'
  options: {
    label: string
    placeholder: string
    selection_type: SingleSelect
    chart_type: ChartType
    choices: Choice[]
  }
  answers: TextAnswer[]
}

export type MultipleSelectQuestion = BaseQuestion & {
  type: 'multiple_select'
  options: {
    label: string
    placeholder: string
    selection_type: MultipleSelectSelectionType
    chart_type: ChartType
    choices: Choice[]
  }
  answers: MultipleSelectAnswer[]
}

export type Question = TextQuestion | SingleSelectQuestion | MultipleSelectQuestion

export type QuestionType = Question['type']
