import type { Talk } from '../types/talk'
import { inject } from 'vue'
import { runTalk } from '../utils/api'

interface UseInaliaTalk {
  talk: Talk | null
  run: () => Promise<void>
}
export function useInaliaTalk(): UseInaliaTalk {
  // If the talk is null, the addon is considered to be in static mode.
  const talk = inject<Talk | null>('talk', null)

  async function run(): Promise<void> {
    await runTalk()

    window.location.reload()
  }

  return {
    talk,
    run,
  }
}
