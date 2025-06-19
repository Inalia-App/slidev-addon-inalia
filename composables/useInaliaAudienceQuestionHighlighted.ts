import type { DeepReadonly, Ref } from 'vue'
import type { AudienceQuestion } from '../types/audience-question'
import { readonly, ref } from 'vue'
import { talkChannel } from '../utils/channels'
import { useInaliaTalk } from './useInaliaTalk'

interface UseInaliaAudienceQuestionHighlighted {
  audienceQuestion: DeepReadonly<Ref<AudienceQuestion | null>>
  listen: () => void
  dispose: () => void
}

export function useInaliaAudienceQuestionHighlighted(): UseInaliaAudienceQuestionHighlighted {
  const { talk } = useInaliaTalk()

  const audienceQuestion = ref<AudienceQuestion | null>(null)

  if (!talk) {
    console.warn('Inalia is running in static mode. Audience question highlighting is disabled.')

    return {
      audienceQuestion: readonly(audienceQuestion),
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
      .listen('AudienceQuestionHighlighted', (question: AudienceQuestion) => {
        audienceQuestion.value = question
      })
  }

  function dispose(): void {
    if (!talk) {
      return
    }

    window.Echo
      .private(talkChannel(talk.id))
      .stopListening('AudienceQuestionHighlighted')
  }

  return {
    audienceQuestion: readonly(audienceQuestion),
    listen,
    dispose,
  }
}
