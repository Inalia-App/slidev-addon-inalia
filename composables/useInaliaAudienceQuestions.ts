import type { DeepReadonly, Ref } from 'vue'
import type { AudienceQuestion } from '../types/audience-question'
import { readonly, ref } from 'vue'
import { fetchAudienceQuestions } from '../utils/api'
import { talkChannel } from '../utils/channels'
import { EVENT_AUDIENCE_QUESTION_CREATED } from '../utils/events'
import { useInaliaTalk } from './useInaliaTalk'

interface UseInaliaAudienceQuestions {
  audienceQuestions: DeepReadonly<Ref<AudienceQuestion[] | null>>
  fetch: () => Promise<void>
  listen: () => void
  dispose: () => void
}

export function useInaliaAudienceQuestions(): UseInaliaAudienceQuestions {
  const { talk } = useInaliaTalk()

  const audienceQuestions = ref<AudienceQuestion[] | null>(null)

  if (!talk) {
    console.warn('Inalia is running in static mode. Audience questions are disabled.')

    return {
      audienceQuestions: readonly(audienceQuestions),
      fetch: async () => {},
      listen: () => {},
      dispose: () => {},
    }
  }

  async function fetch(): Promise<void> {
    if (!talk) {
      return
    }

    audienceQuestions.value = await fetchAudienceQuestions()
  }

  function listen(): void {
    if (!talk) {
      return
    }

    window.Echo
      .private(talkChannel(talk.id))
      .listen(EVENT_AUDIENCE_QUESTION_CREATED, (audienceQuestion: AudienceQuestion) => {
        audienceQuestions.value ??= []
        audienceQuestions.value.push(audienceQuestion)
      })
  }

  function dispose(): void {
    if (!talk) {
      return
    }

    window.Echo
      .private(talkChannel(talk.id))
      .stopListening(EVENT_AUDIENCE_QUESTION_CREATED)
  }

  return {
    audienceQuestions: readonly(audienceQuestions),
    fetch,
    listen,
    dispose,
  }
}
