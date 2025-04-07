import type { Talk } from '../types'
import { inject } from 'vue'

interface UseInaliaTalk {
  talk: Talk | null
}
export function useInaliaTalk(): UseInaliaTalk {
  const talk = inject<Talk | null>('talk', null) // Can only be null in static mode because the fetch is awaited in the setup function.

  return {
    talk,
  }
}
