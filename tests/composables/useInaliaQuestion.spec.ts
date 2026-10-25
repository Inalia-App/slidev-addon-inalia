import type { Question } from '../../types/question'
import type { Talk } from '../../types/talk'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useInaliaQuestion } from '../../composables/useInaliaQuestion'
import { fetchQuestion } from '../../utils/api'
import { answersChannel } from '../../utils/channels'
import { EVENT_ANSWER_CREATED } from '../../utils/events'

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
let echoStopListening: ReturnType<typeof vi.fn>

const fetchQuestionMock = vi.mocked(fetchQuestion)

function mountHost(initialQuestionId?: number, options: { talk?: Talk | null, provideTalk?: boolean } = {}) {
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
        username: 'current-owner',
        ...(options.provideTalk === false ? {} : { talk: options.talk === undefined ? talk : options.talk }),
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
  echoStopListening = vi.fn()
  echoPrivate = vi.fn(() => ({
    listen: echoListen,
    stopListening: echoStopListening,
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
  it('removes only its own listener on unmount', async () => {
    fetchQuestionMock.mockResolvedValue(question)
    const first = mountHost(question.id)
    await flushInalia()
    const firstHandler = echoListen.mock.calls[0][1]
    const second = mountHost(question.id)
    await flushInalia()
    const secondHandler = echoListen.mock.calls[1][1]

    first.unmount()
    expect(echoStopListening).toHaveBeenCalledWith(EVENT_ANSWER_CREATED, firstHandler)
    expect(echoStopListening).not.toHaveBeenCalledWith(EVENT_ANSWER_CREATED, secondHandler)
    expect(echoLeave).not.toHaveBeenCalled()

    second.unmount()
    expect(echoStopListening).toHaveBeenCalledWith(EVENT_ANSWER_CREATED, secondHandler)
  })

  it('ignores an older request that resolves after the current question', async () => {
    let resolveFirst!: (value: Question) => void
    fetchQuestionMock.mockImplementationOnce(() => new Promise((resolve) => {
      resolveFirst = resolve
    }))
    const secondQuestion = { ...question, id: 8, number: 8 }
    fetchQuestionMock.mockResolvedValueOnce(secondQuestion)
    const wrapper = mountHost(question.id)
    questionId.value = 8
    await flushInalia()
    expect(inalia.question.value?.id).toBe(8)

    resolveFirst(question)
    await flushInalia()
    expect(inalia.question.value?.id).toBe(8)
    wrapper.unmount()
  })

  it.each(['clear', 'unmount'])('ignores pending responses after %s', async (action) => {
    let resolveRequest!: (value: Question) => void
    fetchQuestionMock.mockImplementationOnce(() => new Promise((resolve) => {
      resolveRequest = resolve
    }))
    const wrapper = mountHost(question.id)
    if (action === 'clear')
      questionId.value = undefined
    else
      wrapper.unmount()
    await flushInalia()
    resolveRequest(question)
    await flushInalia()

    expect(inalia.question.value).toBeNull()
    expect(echoListen).not.toHaveBeenCalled()
    if (action === 'clear')
      wrapper.unmount()
  })

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

  it('clears the current question and removes its listener when the question ID becomes undefined', async () => {
    fetchQuestionMock.mockResolvedValue(question)

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mountHost(question.id)

    await flushInalia()

    expect(fetchQuestionMock).toHaveBeenCalledWith('current-owner', question.id)
    expect(echoPrivate).toHaveBeenCalledWith(answersChannel(question.id))

    questionId.value = undefined
    await flushInalia()

    expect(fetchQuestionMock).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith(warningMessage)
    expect(echoStopListening).toHaveBeenCalledWith(EVENT_ANSWER_CREATED, echoListen.mock.calls[0][1])
    expect(echoLeave).not.toHaveBeenCalled()
    expect(inalia.question.value).toBeNull()
    expect(inalia.data.value).toEqual([])

    wrapper.unmount()
  })

  it('skips fetching when Inalia is not running', async () => {
    const wrapper = mountHost(question.id, { provideTalk: false })

    await flushInalia()

    expect(fetchQuestionMock).not.toHaveBeenCalled()
    expect(inalia.question.value).toBeNull()
    expect(inalia.data.value).toEqual([])
    expect(echoPrivate).not.toHaveBeenCalled()

    wrapper.unmount()
  })
})
