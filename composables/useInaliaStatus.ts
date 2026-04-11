import type { Talk } from '../types/talk'
import { inject } from 'vue'

interface UseInaliaStatus {
  isRunning: boolean
  isStaticMode: boolean
  status: 'running' | 'static'
}

export function useInaliaStatus(): UseInaliaStatus {
  const talk = inject<Talk | null>('talk', null)
  const isRunning = talk !== null

  return {
    isRunning,
    isStaticMode: !isRunning,
    status: isRunning ? 'running' : 'static',
  }
}
