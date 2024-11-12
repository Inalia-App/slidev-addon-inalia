import type { DeepReadonly, Ref, ShallowRef } from 'vue'
import type { Data } from './data'
import type { Question } from './question'

export interface Inalia {
  isStatic: Readonly<Ref<boolean>>

  question: DeepReadonly<ShallowRef<Question | null>>
  data: DeepReadonly<Ref<Data>>
}
