import type { DeepReadonly, Ref } from 'vue'
import type { AugmentedLiveReaction, LiveReaction } from '../types/live-reaction'
import { randomUUID } from 'uncrypto'
import { readonly, ref } from 'vue'
import { talkChannel } from '../utils/channels'
import { EVENT_LIVE_REACTION_SUBMITTED } from '../utils/events'
import { useInaliaTalk } from './useInaliaTalk'

interface UseInaliaLiveReactions {
  liveReactions: DeepReadonly<Ref<AugmentedLiveReaction[]>>
  listen: () => void
  dispose: () => void
}

export function useInaliaLiveReactions(): UseInaliaLiveReactions {
  const { talk } = useInaliaTalk()

  const liveReactions = ref<AugmentedLiveReaction[]>([])

  if (!talk) {
    console.warn('Inalia is running in static mode. Live reactions are disabled.')

    return {
      liveReactions: readonly(liveReactions),
      listen: () => {},
      dispose: () => {},
    }
  }

  function listen(): void {
    if (!talk) {
      return
    }

    window.Echo
      .private(talkChannel(talk.id))
      .listen(EVENT_LIVE_REACTION_SUBMITTED, (liveReaction: LiveReaction) => {
        const id = randomUUID()

        liveReactions.value.push({
          ...liveReaction,
          id,
          // Randomize the position and scale of the live reaction
          // to make it look more dynamic and less repetitive
          position: {
            x: Math.random() * 80 + 10,
            y: Math.random() * 4 + 2,
          },
          scale: Math.random() * 0.5 + 0.75,
        })

        // Automatically remove the live reaction after 3 seconds
        setTimeout(() => {
          liveReactions.value = liveReactions.value.filter(liveReaction => liveReaction.id !== id)
        }, 3000)
      })
  }

  function dispose(): void {
    if (!talk) {
      return
    }

    window.Echo.leave(talkChannel(talk.id))
  }

  return {
    liveReactions: readonly(liveReactions),

    listen,
    dispose,
  }
}
