import type { DeepReadonly, Ref } from 'vue'
import type { AudienceQuestion } from '../types/audience-question'
import { readonly, ref } from 'vue'
import { talkChannel } from '../utils/channels'
import { EVENT_AUDIENCE_QUESTION_HIGHLIGHTED, EVENT_AUDIENCE_QUESTION_UNHIGHLIGHTED } from '../utils/events'
import { useInaliaTalk } from './useInaliaTalk'

interface UseInaliaAudienceQuestionHighlighted {
  audienceQuestion: DeepReadonly<Ref<AudienceQuestion | null>>
  clearAudienceQuestion: () => void
  listen: () => void
  dispose: () => void
}

interface useInaliaAudienceQuestionHighlightedParams {
  onUnhighlighted?: () => void
}
export function useInaliaAudienceQuestionHighlighted(params: useInaliaAudienceQuestionHighlightedParams = {}): UseInaliaAudienceQuestionHighlighted {
  const { talk } = useInaliaTalk()

  const audienceQuestion = ref<AudienceQuestion | null>(null)

  if (!talk) {
    console.warn('Inalia is running in static mode. Audience question highlighting is disabled.')

    return {
      audienceQuestion: readonly(audienceQuestion),
      clearAudienceQuestion: () => {},
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
      .listen(EVENT_AUDIENCE_QUESTION_HIGHLIGHTED, (question: AudienceQuestion) => {
        audienceQuestion.value = question
      })
      .listen(EVENT_AUDIENCE_QUESTION_UNHIGHLIGHTED, () => {
        if (params.onUnhighlighted) {
          return params.onUnhighlighted()
        }

        clearAudienceQuestion()
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

  function clearAudienceQuestion(): void {
    audienceQuestion.value = null
  }

  return {
    audienceQuestion: readonly(audienceQuestion),
    clearAudienceQuestion,
    listen,
    dispose,
  }
}
