import type { LiveReaction } from '../../types/live-reaction'
import type { Talk } from '../../types/talk'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import InaliaLiveReactions from '../../components/InaliaLiveReactions.vue'
import { talkChannel } from '../../utils/channels'
import { EVENT_LIVE_REACTION_SUBMITTED } from '../../utils/events'

const talk: Talk = {
  id: 42,
  title: 'Testing live reactions',
  description: 'A talk just for tests',
  color: '#6b46c1',
  scheduled_at: {
    iso: '2026-04-08T12:00:00Z',
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

type LiveReactionHandler = (liveReaction: LiveReaction) => void

let liveReactionHandler: LiveReactionHandler | null = null
let echoPrivate: ReturnType<typeof vi.fn>
let echoListen: ReturnType<typeof vi.fn>
let echoLeave: ReturnType<typeof vi.fn>

function mountComponent(options: { disabled?: boolean, maxEmojis?: number, talk?: Talk | null } = {}) {
  return mount(InaliaLiveReactions, {
    props: {
      disabled: options.disabled ?? false,
      ...(options.maxEmojis !== undefined && { maxEmojis: options.maxEmojis }),
    },
    global: {
      provide: {
        talk: options.talk === undefined ? talk : options.talk,
      },
    },
  })
}

function emitLiveReaction(liveReaction: LiveReaction): void {
  expect(liveReactionHandler).toBeTypeOf('function')
  liveReactionHandler?.(liveReaction)
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.spyOn(Math, 'random').mockReturnValue(0.5)

  liveReactionHandler = null
  echoListen = vi.fn((_event: string, handler: LiveReactionHandler) => {
    liveReactionHandler = handler
  })
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
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('inaliaLiveReactions', () => {
  it('subscribes on mount and leaves the talk channel on unmount', () => {
    const wrapper = mountComponent()

    expect(echoPrivate).toHaveBeenCalledWith(talkChannel(talk.id))
    expect(echoListen).toHaveBeenCalledWith(EVENT_LIVE_REACTION_SUBMITTED, expect.any(Function))

    wrapper.unmount()

    expect(echoLeave).toHaveBeenCalledWith(talkChannel(talk.id))
  })

  it('renders emitted reactions and removes them after 3 seconds', async () => {
    const wrapper = mountComponent()

    emitLiveReaction({ emoji: '🔥' })
    await nextTick()

    const reaction = wrapper.get('.inalia-live-reaction')
    expect(reaction.text()).toBe('🔥')
    expect(reaction.attributes('style')).toContain('left: 50%')
    expect(reaction.attributes('style')).toContain('bottom: 4%')
    expect(reaction.attributes('style')).toContain('transform: scale(1)')

    await vi.advanceTimersByTimeAsync(3000)
    await nextTick()

    expect(wrapper.find('.inalia-live-reaction').exists()).toBe(false)
  })

  it('keeps listening while disabled and reveals buffered reactions when re-enabled', async () => {
    const wrapper = mountComponent({ disabled: true })

    expect(echoListen).toHaveBeenCalledTimes(1)

    emitLiveReaction({ emoji: '🔥' })
    await nextTick()

    expect(wrapper.text()).not.toContain('🔥')

    await wrapper.setProps({ disabled: false })

    expect(wrapper.text()).toContain('🔥')
    expect(echoPrivate).toHaveBeenCalledTimes(1)
  })

  it('does not subscribe in static mode', () => {
    const wrapper = mountComponent({ talk: null })

    expect(echoPrivate).not.toHaveBeenCalled()

    wrapper.unmount()

    expect(echoLeave).not.toHaveBeenCalled()
  })

  it('ignores new reactions when the number of displayed reactions reaches maxEmojis', async () => {
    const wrapper = mountComponent({ maxEmojis: 2 })

    emitLiveReaction({ emoji: '🔥' })
    emitLiveReaction({ emoji: '🎉' })
    await nextTick()

    expect(wrapper.findAll('.inalia-live-reaction')).toHaveLength(2)

    emitLiveReaction({ emoji: '🚀' })
    await nextTick()

    const reactions = wrapper.findAll('.inalia-live-reaction')
    expect(reactions).toHaveLength(2)
    expect(reactions[0].text()).toBe('🔥')
    expect(reactions[1].text()).toBe('🎉')
  })
})
