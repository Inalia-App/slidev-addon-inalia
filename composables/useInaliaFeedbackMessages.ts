import type { DeepReadonly, Ref } from 'vue'
import type { FeedbackMessage } from '../types/feedback-message'
import { readonly, ref } from 'vue'
import { fetchFeedbackMessages } from '../utils/api'
import { talkChannel } from '../utils/channels'
import { EVENT_FEEDBACK_MESSAGE_CREATED } from '../utils/events'
import { useInaliaTalk } from './useInaliaTalk'

interface UseInaliaFeedbackMessages {
  feedbackMessages: DeepReadonly<Ref<FeedbackMessage[] | null>>
  fetch: () => Promise<void>
  listen: () => void
  dispose: () => void
}

export function useInaliaFeedbackMessages(): UseInaliaFeedbackMessages {
  const { talk } = useInaliaTalk()

  const feedbackMessages = ref<FeedbackMessage[] | null>(null)

  if (!talk) {
    console.warn('Inalia is running in static mode. Feedback messages are disabled.')

    return {
      feedbackMessages: readonly(feedbackMessages),
      fetch: async () => {},
      listen: () => {},
      dispose: () => {},
    }
  }

  async function fetch(): Promise<void> {
    if (!talk) {
      return
    }

    feedbackMessages.value = await fetchFeedbackMessages()
  }

  function listen(): void {
    if (!talk) {
      return
    }

    window.Echo
      .private(talkChannel(talk.id))
      .listen(EVENT_FEEDBACK_MESSAGE_CREATED, (e: FeedbackMessage) => {
        feedbackMessages.value ??= []
        feedbackMessages.value.push(e)
      })
  }

  function dispose(): void {
    if (!talk) {
      return
    }

    window.Echo
      .private(talkChannel(talk.id))
      .stopListening(EVENT_FEEDBACK_MESSAGE_CREATED)
  }

  return {
    feedbackMessages: readonly(feedbackMessages),
    fetch,
    listen,
    dispose,
  }
}
