import type { MaybeRefOrGetter } from 'vue'
import type { Data, SelectData, TextData } from '../../types/data'
import type { InaliaLite } from '../../types/lite/inalia'
import type { Question, QuestionType } from '../../types/lite/question'
import { computed, onMounted, readonly, ref, shallowRef, toRef, watch, watchEffect } from 'vue'
import { fetchAnswers, fetchQuestion } from '../../utils/lite/api'
import { isStaticTalk } from '../../utils/lite/static'
import { createAnswersCreateUrl } from '../../utils/lite/urls'
import { useInaliaLiteTalkWs } from './useInaliaLiteTalkWs'

interface UseInaliaLiteQuestionOptions {
  /**
   * The question ID to fetch.
   */
  questionId?: number
  /**
   * Static mode.
   */
  static?: {
    /**
     * The question to display.
     */
    question?: string
    /**
     * The type of the question.
     */
    type?: QuestionType
    /**
     * The data to use.
     */
    data?: Data
  }
}
export function useInaliaLiteQuestion(options: MaybeRefOrGetter<UseInaliaLiteQuestionOptions>): InaliaLite {
  const _options = toRef(options)

  const isStaticQuestion = computed(() => !!(
    _options.value.static
    && _options.value.static.question
    && _options.value.static.type
    && _options.value.static.data
  ))

  if (isStaticTalk && !isStaticQuestion.value) {
    throw new Error('Static mode is globally enabled, but static options are not properly provided. Please provide static options when using static mode.')
  }

  if (!isStaticTalk && !isStaticQuestion.value && !_options.value.questionId) {
    throw new Error('questionId is required when static mode is disabled. Please provide a questionId to fetch the question and answers.')
  }

  if (isStaticQuestion.value && _options.value.questionId) {
    throw new Error('Static mode is enabled, but questionId is provided. Please remove questionId when using static mode.')
  }

  const question = shallowRef<Question | null>(null)
  const data = ref<Data>([])

  const url = computed(() => {
    if (isStaticQuestion.value) {
      return null
    }

    return createAnswersCreateUrl(_options.value.questionId!)
  })

  watchEffect(() => {
    if (!isStaticQuestion.value) {
      return
    }

    if (_options.value.static!.type === 'text') {
      question.value = {
        id: 0,
        question: _options.value.static!.question!,
        type: 'text',
        label: '',
        placeholder: '',
      }
    }
    else if (_options.value.static!.type === 'single_select') {
      question.value = {
        id: 0,
        question: _options.value.static!.question!,
        type: 'single_select',
        label: '',
        placeholder: '',
        options: {
          choices: [],
        },
      }
    }

    data.value = _options.value.static!.data!
  })

  onMounted(() => {
    if (isStaticQuestion.value || !_options.value.questionId) {
      return
    }

    fetch()
  })

  watch(() => _options.value.questionId, () => {
    if (isStaticQuestion.value || !_options.value.questionId) {
      return
    }

    fetch()
  })

  async function fetch(): Promise<void> {
    if (!_options.value.questionId) {
      return
    }

    question.value = await fetchQuestion(_options.value.questionId)
    const answers = await fetchAnswers(_options.value.questionId)

    if (question.value.type === 'text') {
      data.value = answers.data.map(answer => answer.value) as TextData
    }
    else if (question.value.type === 'single_select') {
      data.value = question.value.options.choices.map((choice) => {
        const count = answers.data.filter(answer => answer.value === choice.value).length

        return {
          count,
          label: choice.text,
          color: choice.color,
        }
      }) as SelectData
    }
  }

  const { data: wsData } = useInaliaLiteTalkWs()
  // FIXME: should be a computed that merges API data and WS data, but we need to handle the case where the question type is not yet loaded (because the question is fetched from the API)¬˚
  watch(wsData, (newData) => {
    if (!_options.value.questionId) {
      return
    }

    const questionId = _options.value.questionId
    const answers = newData[questionId]
    if (!answers) {
      return
    }

    if (question.value?.type === 'text') {
      data.value.push(...(answers as string[]))
    }
    else if (question.value?.type === 'single_select') {
      const existingData = data.value as SelectData
      const newData = (answers as string[]).reduce((acc, answer) => {
        const existingChoice = existingData.find(choice => choice.label === answer)
        if (existingChoice) {
          return acc.map(choice => choice.label === answer ? { ...choice, count: choice.count + 1 } : choice)
        }

        throw new Error(`Received an answer with value "${answer}" that does not match any existing choice. Please ensure that the question options are properly configured and that the answers being sent are valid.`)
      }, existingData)

      data.value = newData
    }
  })

  // TODO: listen websocket for the talk
  // TODO: stop listening (but create a single one using a singleton)
  // maybe, we need to dedup between answers from the API and the websocket, using the answer ID?

  return {
    url: readonly(url),
    question: readonly(question),
    data: readonly(data),
  }
}
