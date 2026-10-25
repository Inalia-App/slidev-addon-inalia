import type { Talk } from '../types/talk'
import { inject } from 'vue'

interface UseInaliaStatus {
  /** Whether Inalia has a configured, loaded talk (rather than static mode). */
  isLive: boolean
  /** @deprecated Use isLive. This flag does not represent talk.state.running. */
  isRunning: boolean
}

export function useInaliaStatus(): UseInaliaStatus {
  const talk = inject<Talk | null>('talk', null)

  const isLive = talk !== null

  return {
    isLive,
    isRunning: isLive,
  }
}
