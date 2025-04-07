import type { DeepReadonly, Ref } from 'vue'
import type { FeedbackReaction } from '../types/feedback-reaction'
import { readonly, ref } from 'vue'
import { fetchFeedbackReactions } from '../utils/api'
import { talkChannel } from '../utils/channels'
import { EVENT_FEEDBACK_REACTION_CREATED } from '../utils/events'
import { useInaliaTalk } from './useInaliaTalk'

interface UseInaliaFeedbackReactions {
  feedbackReactions: DeepReadonly<Ref<FeedbackReaction[] | null>>
  fetch: () => Promise<void>
  listen: () => void
  dispose: () => void
}

export function useInaliaFeedbackReactions(): UseInaliaFeedbackReactions {
  const { talk } = useInaliaTalk()

  const feedbackReactions = ref<FeedbackReaction[] | null>(null)

  if (!talk) {
    console.warn('Inalia is running in static mode. Feedback reactions are disabled.')

    return {
      feedbackReactions: readonly(feedbackReactions),
      fetch: async () => {},
      listen: () => {},
      dispose: () => {},
    }
  }

  async function fetch(): Promise<void> {
    if (!talk) {
      return
    }

    feedbackReactions.value = await fetchFeedbackReactions()
  }

  function listen(): void {
    if (!talk) {
      return
    }

    window.Echo.private(talkChannel(talk.id))
      .listen(EVENT_FEEDBACK_REACTION_CREATED, (e: { feedback_reaction_id: number }) => {
        feedbackReactions.value ??= []

        const feedbackReaction = feedbackReactions.value.find(
          reaction => reaction.id === e.feedback_reaction_id,
        )

        if (!feedbackReaction) {
          return
        }

        feedbackReaction.feedback_reactions_count = (feedbackReaction.feedback_reactions_count ?? 0) + 1
      })
  }

  function dispose(): void {
    if (!talk) {
      return
    }

    window.Echo
      .private(talkChannel(talk.id))
      .stopListening(EVENT_FEEDBACK_REACTION_CREATED)
  }

  return {
    feedbackReactions: readonly(feedbackReactions),
    fetch,
    listen,
    dispose,
  }
}
