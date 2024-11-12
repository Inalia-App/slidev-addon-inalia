export interface TextAnswer {
  value: string
}

export interface MultipleSelectAnswer {
  value: string[]
}

export type Answer = TextAnswer | MultipleSelectAnswer
