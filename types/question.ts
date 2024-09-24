export type QuestionType = 'text' | 'single_select' | 'multi_select'

export type ChartType = 'bar' | 'donut'

export interface Question {
  id: number
  question: string
  type: QuestionType
  chartType: ChartType
}
