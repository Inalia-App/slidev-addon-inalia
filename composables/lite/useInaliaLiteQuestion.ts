import type { MaybeRefOrGetter } from 'vue'
import type { Data, SelectData, TextData } from '../../types/data'
import type { InaliaLite } from '../../types/lite/inalia'
import type { Question, QuestionType } from '../../types/lite/question'
import { onMounted, readonly, ref, shallowRef, toRef, watch, watchEffect } from 'vue'
import { fetchAnswers, fetchQuestion } from '../../utils/lite/api'
import { isStaticEnabled } from '../../utils/lite/static'

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

  if (isStaticEnabled && !_options.value.static) {
    throw new Error('Static mode is enabled, but no static options are provided.')
  }

  if (isStaticEnabled && _options.value.questionId) {
    throw new Error('Static mode is enabled, but questionId is provided.')
  }

  const question = shallowRef<Question | null>(null)
  const data = ref<Data>([])

  watchEffect(() => {
    if (
      !isStaticEnabled
      || !_options.value.static
      || !_options.value.static.question
      || !_options.value.static.type
      || !_options.value.static.data
    ) {
      return
    }

    if (_options.value.static.type === 'text') {
      question.value = {
        id: 0,
        question: _options.value.static.question,
        type: 'text',
        label: '',
        placeholder: '',
      }
    }
    else if (_options.value.static.type === 'single_select') {
      question.value = {
        id: 0,
        question: _options.value.static.question,
        type: 'single_select',
        label: '',
        placeholder: '',
        options: {
          choices: [],
        },
      }
    }

    data.value = _options.value.static.data
  })

  onMounted(() => {
    if (isStaticEnabled || !_options.value.questionId) {
      return
    }

    fetch()
  })

  watch(() => _options.value.questionId, () => {
    if (isStaticEnabled || !_options.value.questionId) {
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

  // TODO: listen websocket for the talk
  // TODO: stop listening (but create a single one using a singleton)
  // maybe, we need to dedup between answers from the API and the websocket, using the answer ID?

  return {
    question: readonly(question),
    data: readonly(data),
  }
}
