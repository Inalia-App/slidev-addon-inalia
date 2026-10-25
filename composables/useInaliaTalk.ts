import type { Talk } from '../types/talk'
import { inject } from 'vue'
import { runTalk, startDemoMode, stopDemoMode } from '../utils/api'

interface UseInaliaTalk {
  talk: Talk | null
  run: () => Promise<void>
  toggleDemoMode: () => Promise<void>
}
export function useInaliaTalk(): UseInaliaTalk {
  // If the talk is null, the addon is considered to be in static mode.
  const talk = inject<Talk | null>('talk', null)
  const username = inject<string | undefined>('username', undefined)

  async function run(): Promise<void> {
    if (!username)
      throw new Error('Inalia account has not been initialized.')

    await runTalk(username)

    window.location.reload()
  }

  async function toggleDemoMode(): Promise<void> {
    if (!username || !talk)
      throw new Error('Inalia account has not been initialized.')

    if (talk.demo_mode) {
      await stopDemoMode(username)
    }
    else {
      await startDemoMode(username)
    }

    window.location.reload()
  }

  return {
    talk,
    run,
    toggleDemoMode,
  }
}
