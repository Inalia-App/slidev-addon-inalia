import type { Question } from '../../types/question'
import type { Talk } from '../../types/talk'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useInaliaQuestion } from '../../composables/useInaliaQuestion'
import { fetchQuestion } from '../../utils/api'
import { answersChannel } from '../../utils/channels'

vi.mock('../../utils/api', () => ({
  fetchQuestion: vi.fn(),
}))

const warningMessage = '[slidev-addon-inalia] `useInaliaQuestion` received an undefined question ID without static content. Skipping question fetch.'

const question: Question = {
  id: 7,
  number: 7,
  tiny_url: 'https://inalia.app/q/7',
  question: 'What should we test?',
  type: 'text',
  options: {
    label: 'Answer',
    placeholder: 'Type here',
  },
  answers: [],
}

const talk: Talk = {
  id: 42,
  title: 'Composable testing talk',
  description: 'A talk for question tests',
  color: '#6b46c1',
  scheduled_at: {
    iso: '2026-04-10T12:00:00Z',
    time_ago: 'just now',
  },
  state: {
    disabled: false,
    running: true,
    finished: false,
  },
  slidev: {
    run_to_continue: false,
  },
  urls: {
    details: 'https://example.com/details',
    overview: 'https://example.com/overview',
    dashboard: 'https://example.com/dashboard',
    tiny_overview: 'https://example.com/o',
    tiny_feedback: 'https://example.com/f',
  },
}

let questionId = ref<number | undefined>()
let inalia: ReturnType<typeof useInaliaQuestion>
let echoPrivate: ReturnType<typeof vi.fn>
let echoListen: ReturnType<typeof vi.fn>
let echoLeave: ReturnType<typeof vi.fn>

const fetchQuestionMock = vi.mocked(fetchQuestion)

function mountHost(initialQuestionId?: number, options: { talk?: Talk | null } = {}) {
  questionId = ref(initialQuestionId)

  const Host = defineComponent({
    setup() {
      inalia = useInaliaQuestion(questionId)

      return () => h('div')
    },
  })

  return mount(Host, {
    global: {
      provide: {
        talk: options.talk === undefined ? talk : options.talk,
      },
    },
  })
}

async function flushInalia(): Promise<void> {
  await Promise.resolve()
  await nextTick()
  await Promise.resolve()
  await nextTick()
}

beforeEach(() => {
  fetchQuestionMock.mockReset()

  echoListen = vi.fn()
  echoPrivate = vi.fn(() => ({
    listen: echoListen,
  }))
  echoLeave = vi.fn()

  window.Echo = {
    private: echoPrivate,
    leave: echoLeave,
  } as unknown as Window['Echo']
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useInaliaQuestion', () => {
  it('warns and skips fetching when the question ID is undefined without static content', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mountHost()

    await flushInalia()

    expect(fetchQuestionMock).not.toHaveBeenCalled()
    expect(warn).toHaveBeenCalledWith(warningMessage)
    expect(inalia.question.value).toBeNull()
    expect(inalia.data.value).toEqual([])
    expect(echoPrivate).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  it('clears the current question and leaves the previous channel when the question ID becomes undefined', async () => {
    fetchQuestionMock.mockResolvedValue(question)

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mountHost(question.id)

    await flushInalia()

    expect(fetchQuestionMock).toHaveBeenCalledWith(question.id)
    expect(echoPrivate).toHaveBeenCalledWith(answersChannel(question.id))

    questionId.value = undefined
    await flushInalia()

    expect(fetchQuestionMock).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith(warningMessage)
    expect(echoLeave).toHaveBeenCalledWith(answersChannel(question.id))
    expect(inalia.question.value).toBeNull()
    expect(inalia.data.value).toEqual([])

    wrapper.unmount()
  })

  it('skips fetching when the talk is unavailable', async () => {
    const wrapper = mountHost(question.id, { talk: null })

    await flushInalia()

    expect(fetchQuestionMock).not.toHaveBeenCalled()
    expect(inalia.question.value).toBeNull()
    expect(inalia.data.value).toEqual([])
    expect(echoPrivate).not.toHaveBeenCalled()

    wrapper.unmount()
  })
})
