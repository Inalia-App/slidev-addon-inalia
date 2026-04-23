import type { DeepReadonly, MaybeRefOrGetter, Ref } from 'vue'
import type { AugmentedLiveReaction, LiveReaction } from '../types/live-reaction'
import { randomUUID } from 'uncrypto'
import { computed, readonly, ref, toValue } from 'vue'
import { talkChannel } from '../utils/channels'
import { EVENT_LIVE_REACTION_SUBMITTED } from '../utils/events'
import { useInaliaTalk } from './useInaliaTalk'

interface UseInaliaLiveReactions {
  liveReactions: DeepReadonly<Ref<AugmentedLiveReaction[]>>
  listen: () => void
  dispose: () => void
}

const DEFAULT_MAX_EMOJIS = 20

interface UseInaliaLiveReactionsParams {
  disabled?: boolean
  maxEmojis?: number
}

export function useInaliaLiveReactions(params: MaybeRefOrGetter<UseInaliaLiveReactionsParams>): UseInaliaLiveReactions {
  const { talk } = useInaliaTalk()

  const allLiveReactions = ref<AugmentedLiveReaction[]>([])

  const disabled = computed(() => toValue(params).disabled)
  const maxEmojis = computed(() => toValue(params).maxEmojis ?? DEFAULT_MAX_EMOJIS)
  const liveReactions = computed(() => (disabled.value ? [] : allLiveReactions.value))

  if (!talk) {
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
        if (allLiveReactions.value.length >= maxEmojis.value) {
          return
        }

        const id = randomUUID()

        allLiveReactions.value.push({
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
          allLiveReactions.value = allLiveReactions.value.filter(liveReaction => liveReaction.id !== id)
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
