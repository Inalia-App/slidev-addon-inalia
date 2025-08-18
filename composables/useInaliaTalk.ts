import type { Talk } from '../types/talk'
import { inject } from 'vue'
import { runTalk } from '../utils/api'

interface UseInaliaTalk {
  talk: Talk | null
  run: () => Promise<void>
}
export function useInaliaTalk(): UseInaliaTalk {
  const talk = inject<Talk | null>('talk', null) // Can only be null in static mode because the fetch is awaited in the setup function.

  async function run(): Promise<void> {
    await runTalk()

    window.location.reload()
  }

  return {
    talk,
    run,
  }
}
