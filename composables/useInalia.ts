import type { MaybeRefOrGetter, Ref } from 'vue'
import type { Answer, StaticAnswer } from '../types/answer'
import type { Inalia } from '../types/inalia'
import type { Question, StaticQuestion } from '../types/question'
import { ofetch } from 'ofetch'
import { computed, onMounted, onUnmounted, readonly, ref, shallowRef, toRef, toValue, watch, watchEffect } from 'vue'
import { getInaliaEnv } from '../utils/env'

interface UseInaliaOptions<Q extends Question> {
  /**
   * Static content to display instead of the dynamically fetched question. This option is useful when you want to deploy your slides after the talk to keep a record of the questions.
   */
  staticContent?: {
    /**
     * The question to display.
     */
    question: MaybeRefOrGetter<string | undefined>
    /**
     * The type of the question.
     */
    type: MaybeRefOrGetter<Q['type'] | undefined>
    /**
     * The answers to display.
     */
    answers: MaybeRefOrGetter<StaticAnswer<Q['type']>[] | undefined>
  }
}

export function useInalia<Q extends Question>(defaultQuestionId: MaybeRefOrGetter<number>, options?: UseInaliaOptions<Q>): Inalia<Q> {
  const { staticContent } = options || {}

  const env = getInaliaEnv()

  const endpoint = env.endpoint
  const username = env.username
  const talkId = env.talkId

  const questionId = toRef(defaultQuestionId)

  const question = shallowRef<Q | null>(null)
  const answers = ref<Answer<Q['type']>[]>([]) as Ref<Answer<Q['type']>[]>

  const isStatic = ref<boolean>(false)

  // If static content is provided, use it instead of fetching the question.
  watchEffect(() => {
    if (!staticContent) {
      return
    }

    const staticQuestion = toValue(staticContent.question)
    const staticType = toValue(staticContent.type)
    const staticAnswers = toValue(staticContent.answers)

    if (!staticQuestion || !staticType || !staticAnswers) {
      return
    }

    question.value = {
      id: 0,
      question: staticQuestion,
      type: staticType,
    } as Q
    answers.value = staticAnswers.map(answer => ({ value: answer }))
    isStatic.value = true
  })

  const answerUrl = computed(() => `${endpoint}/${username}/talks/${talkId}/questions/${questionId.value}/answer`)
  const eventName = computed(() => `Users.${username}.Talks.${talkId}.Questions.${questionId.value}.Answers`)

  onMounted(() => {
    if (isStatic.value) {
      return
    }

    startListening()

    if (!question.value) {
      fetchQuestion()
    }
  })

  onUnmounted(() => {
    if (isStatic.value) {
      return
    }

    stopListening()
  })

  watch(questionId, () => {
    if (isStatic.value) {
      return
    }

    stopListening()
    startListening()

    fetchQuestion()
  })

  async function fetchQuestion(): Promise<void> {
    const data = await ofetch(`${endpoint}/api/${username}/talks/${talkId}/questions/${questionId.value}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${env.apiKey}`,
      },
    })
    question.value = {
      id: data.data.id,
      question: data.data.question,
      type: data.data.type,
    }
    answers.value = data.data.answers
  }

  function startListening(): void {
    window.Echo.private(eventName.value)
      .listen('AnswerCreated', (event: Answer<Q['type']>) => {
        // TODO: handle single_select to aggregate answers
        answers.value.push(event.value)
      })
  }

  function stopListening(): void {
    window.Echo.leave(eventName.value)
  }

  return {
    isStatic: readonly(isStatic),

    question: readonly(question),
    answers,

    answerUrl,
  }
}
