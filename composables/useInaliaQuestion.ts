import type { MaybeRefOrGetter } from 'vue'
import type { Answer, MultipleSelectAnswer, SingleSelectAnswer, TextAnswer } from '../types/answer'
import type { Data, SelectData, TextData } from '../types/data'
import type { Inalia } from '../types/inalia'
import type { ChartType, MultipleSelectQuestion, Question, QuestionType, SingleSelectQuestion, TextQuestion } from '../types/question'
import { computed, onMounted, readonly, ref, shallowRef, toRef, toValue, watch, watchEffect } from 'vue'
import { fetchQuestion } from '../utils/api'
import { answersChannel } from '../utils/channels'
import { EVENT_ANSWER_CREATED } from '../utils/events'
import { useInaliaStatus } from './useInaliaStatus'

interface UseInaliaQuestionOptions {
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
    type: MaybeRefOrGetter<QuestionType | undefined>
    /**
     * The type of the chart to display.
     */
    chart: MaybeRefOrGetter<
      ChartType | undefined
    >
    /**
     * The data to use.
     */
    data: MaybeRefOrGetter<Data | undefined>
  }
}

export function useInaliaQuestion(defaultQuestionId: MaybeRefOrGetter<number | undefined>, options?: UseInaliaQuestionOptions): Inalia {
  const { staticContent } = options || {}

  const { isRunning } = useInaliaStatus()
  const questionId = toRef(defaultQuestionId)

  const question = shallowRef<Question | null>(null)
  const data = ref<Data>([])

  const isStatic = ref<boolean>(false)
  const currentChannel = ref<string | null>(null)

  let hasWarnedForMissingQuestionId = false

  // If static content is provided, use it instead of fetching the question.
  watchEffect(() => {
    if (!staticContent) {
      return
    }

    const staticQuestion = toValue(staticContent.question)
    const staticType = toValue(staticContent.type)
    const staticChart = toValue(staticContent.chart)
    const staticData = toValue(staticContent.data)

    if (!staticQuestion || !staticType || !staticData) {
      return
    }

    if (staticType === 'text') {
      question.value = {
        id: 0,
        number: 0,
        tiny_url: '',
        question: staticQuestion,
        type: 'text',
        options: {
          label: '',
          placeholder: '',
        },
        answers: [],
      } satisfies TextQuestion
    }
    else if (staticType === 'single_select') {
      question.value = {
        id: 0,
        number: 0,
        tiny_url: '',
        question: staticQuestion,
        type: 'single_select',
        options: {
          label: '',
          placeholder: '',
          selection_type: 'single_select',
          chart_type: staticChart || 'bar',
          choices: [],
        },
        answers: [],
      } satisfies SingleSelectQuestion
    }
    else if (staticType === 'multiple_select') {
      question.value = {
        id: 0,
        number: 0,
        tiny_url: '',
        question: staticQuestion,
        type: 'multiple_select',
        options: {
          label: '',
          placeholder: '',
          selection_type: 'multi_select',
          chart_type: staticChart || 'bar',
          choices: [],
        },
        answers: [],
      } satisfies MultipleSelectQuestion
    }

    data.value = staticData

    isStatic.value = true
  })

  const eventName = computed(() => answersChannel(question.value?.id))

  onMounted(() => {
    if (isStatic.value || !isRunning) {
      return
    }

    // Load the talk's question if it is not already loaded.
    if (!question.value) {
      fetch()
    }
  })

  watch(questionId, () => {
    if (isStatic.value || !isRunning) {
      return
    }

    fetch()
  })

  watchEffect(() => {
    if (isStatic.value || !question.value) {
      return
    }

    stopListening()
    startListening()
  })

  async function fetch(): Promise<void> {
    if (!isRunning) {
      return
    }

    const currentQuestionId = toValue(questionId)

    if (currentQuestionId === undefined) {
      if (question.value) {
        stopListening()
      }

      question.value = null
      data.value = []

      if (!hasWarnedForMissingQuestionId) {
        console.warn('[slidev-addon-inalia] `useInaliaQuestion` received an undefined question ID without static content. Skipping question fetch.')
        hasWarnedForMissingQuestionId = true
      }

      return
    }

    hasWarnedForMissingQuestionId = false

    question.value = await fetchQuestion(currentQuestionId)

    if (question.value.type === 'text') {
      data.value = question.value.answers.map(answer => answer.value) as TextData
    }
    else if (question.value.type === 'single_select') {
      data.value = question.value.options.choices.map((choice) => {
        const count = question.value!.answers.filter(answer => answer.value === choice.value).length

        return {
          count,
          label: choice.text,
          color: choice.color,
        }
      }) as SelectData
    }
    else if (question.value.type === 'multiple_select') {
      data.value = question.value.options.choices.reduce((acc, choice) => {
        const count = question.value!.answers.filter(answer => answer.value.includes(choice.value)).length

        acc.push({
          count,
          label: choice.text,
          color: choice.color,
        })

        return acc
      }, [] as SelectData)
    }
  }

  function startListening(): void {
    if (!eventName.value) {
      return
    }

    currentChannel.value = eventName.value

    window.Echo
      .private(currentChannel.value)
      .listen(EVENT_ANSWER_CREATED, (event: Answer) => {
        if (question.value!.type === 'text') {
          (data.value as string[]).push((event as TextAnswer).value)
        }
        else if (question.value!.type === 'single_select') {
          const choice = question.value!.options.choices.find(choice => choice.value === (event as SingleSelectAnswer).value)
          if (!choice) {
            return
          }

          const index = (data.value as SelectData).findIndex(answer => answer.label === choice.text)

          if (index === -1) {
            return
          }

          (data.value[index] as SelectData[number]).count++
        }
        else if (question.value!.type === 'multiple_select') {
          for (const value of (event as MultipleSelectAnswer).value) {
            const choice = question.value!.options.choices.find(choice => choice.value === value)
            if (!choice) {
              return
            }

            const index = (data.value as SelectData).findIndex(answer => answer.label === choice.text)

            if (index === -1) {
              return
            }

            (data.value[index] as SelectData[number]).count++
          }
        }
      })
  }

  function stopListening(): void {
    if (!currentChannel.value) {
      return
    }

    window.Echo.leave(currentChannel.value)
    currentChannel.value = null
  }

  return {
    isStatic: readonly(isStatic),

    question: readonly(question),
    data: readonly(data),
  }
}
