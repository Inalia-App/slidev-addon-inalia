import type { MaybeRefOrGetter } from 'vue'
import type { Answer, ChartType, Data, MultipleSelectAnswer, MultipleSelectQuestion, Question, QuestionType, SelectData, SingleSelectQuestion, TextAnswer, TextData, TextQuestion } from '../types'
import type { Inalia } from '../types/inalia'
import { ofetch } from 'ofetch'
import { computed, onMounted, onUnmounted, readonly, ref, shallowRef, toRef, toValue, watch, watchEffect } from 'vue'
import { getInaliaEnv } from '../utils/env'

interface UseInaliaOptions {
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

export function useInalia(defaultQuestionId: MaybeRefOrGetter<number>, options?: UseInaliaOptions): Inalia {
  const { staticContent } = options || {}

  const env = getInaliaEnv()

  const endpoint = env.endpoint
  const username = env.username
  const talkId = env.talkId

  const questionId = toRef(defaultQuestionId)

  const question = shallowRef<Question | null>(null)
  const data = ref<Data>([])

  const isStatic = ref<boolean>(false)

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
    const response = await ofetch<{ data: Question }>(`${endpoint}/api/${username}/talks/${talkId}/questions/${questionId.value}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${env.apiKey}`,
      },
    })

    question.value = response.data

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
    window.Echo.private(eventName.value)

      .listen('AnswerCreated', (event: Answer) => {
        if (question.value!.type === 'text') {
          (data.value as string[]).push((event as TextAnswer).value)
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
    window.Echo.leave(eventName.value)
  }

  // TODO: improve types like the `state` in Pinia Colada
  return {
    isStatic: readonly(isStatic),

    question: readonly(question),
    data: readonly(data),
  }
}
