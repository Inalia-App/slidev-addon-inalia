import type { Talk } from '../types/talk'
import { inject } from 'vue'

interface UseInaliaStatus {
  isRunning: boolean
}

export function useInaliaStatus(): UseInaliaStatus {
  const talk = inject<Talk | null>('talk', null)

  return {
    isRunning: talk !== null,
  }
}
