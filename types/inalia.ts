import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { Answer } from './answer'
import type { Question } from './question'

export interface Inalia<Q extends Question> {
  isStatic: Readonly<Ref<boolean>>

  question: Readonly<ShallowRef<Question | null>>
  answers: Ref<Answer<Q['type']>[]>

  answerUrl: ComputedRef<string>
}
