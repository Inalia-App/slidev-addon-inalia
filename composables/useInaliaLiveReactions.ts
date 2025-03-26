import type { DeepReadonly, Ref } from 'vue'
import type { AugmentedLiveReaction, LiveReaction } from '../types/live-reaction'
import { randomUUID } from 'uncrypto'
import { onMounted, onUnmounted, readonly, ref } from 'vue'
import { liveReactions as liveReactionsChannel } from '../utils/channels'

interface UseInaliaLiveReactions {
  liveReactions: DeepReadonly<Ref<AugmentedLiveReaction[]>>
}

export function useInaliaLiveReactions(): UseInaliaLiveReactions {
  const liveReactions = ref<AugmentedLiveReaction[]>([])

  onMounted(() => {
    window.Echo
      .private(liveReactionsChannel)
      .listen('LiveReactionSubmitted', (liveReaction: LiveReaction) => {
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
  })

  onUnmounted(() => {
    // Leave the channel when the component is unmounted
    // Mainly used to handle the HMR
    window.Echo.leave(liveReactionsChannel)
  })

  return {
    liveReactions: readonly(liveReactions),
  }
}
