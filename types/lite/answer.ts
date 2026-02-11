export interface TextAnswer {
  value: string
}

export interface SingleSelectAnswer {
  value: string
}

export type Answer = TextAnswer | SingleSelectAnswer

export interface BroadcastedAnswer {
  id: number
  questionId: number
  value: string
}
