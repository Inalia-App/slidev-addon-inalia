import type { AugmentedLiveReaction, LiveReaction } from '../types/live-reaction'
import { randomUUID } from 'uncrypto'
import { onMounted, onUnmounted, ref } from 'vue'
import { liveReactions as liveReactionsChannel } from '../channels'

export function useInaliaLiveReactions() {
  const liveReactions = ref<AugmentedLiveReaction[]>([])

  onMounted(() => {
    window.Echo
      .private(liveReactionsChannel)
      .listen('LiveReactionSubmitted', (liveReaction: LiveReaction) => {
        const id = randomUUID()

        liveReactions.value.push({
          ...liveReaction,
          id,
          position: {
            x: Math.random() * 80 + 10,
            y: Math.random() * 4 + 2,
          },
          scale: Math.random() * 0.5 + 0.75,
        })

        setTimeout(() => {
          liveReactions.value = liveReactions.value.filter(liveReaction => liveReaction.id !== id)
        }, 3000)
      })
  })

  onUnmounted(() => {
    window.Echo.leave(liveReactionsChannel)
  })

  return {
    liveReactions,
  }
}
