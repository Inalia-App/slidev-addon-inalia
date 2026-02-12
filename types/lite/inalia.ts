import type { DeepReadonly, Ref, ShallowRef } from 'vue'
import type { Data } from '../data'
import type { Question } from './question'

export interface InaliaLite {
  url: DeepReadonly<Ref<string | null>>
  question: DeepReadonly<ShallowRef<Question | null>>
  data: DeepReadonly<Ref<Data>>
}
