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
  demo_mode: false,
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
      maxEmojis: options.maxEmojis,
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

  it('caps a synchronous burst at 20 by default without scheduling overflow', async () => {
    const wrapper = mountComponent()

    for (let i = 0; i < 25; i++) {
      emitLiveReaction({ emoji: '🔥' })
    }
    await nextTick()

    expect(wrapper.findAll('.inalia-live-reaction')).toHaveLength(20)
    expect(vi.getTimerCount()).toBe(20)
  })

  it('drops overflow rather than queuing it and accepts new reactions after expiry', async () => {
    const wrapper = mountComponent({ maxEmojis: 2 })
    emitLiveReaction({ emoji: '🔥' })
    emitLiveReaction({ emoji: '🎉' })
    emitLiveReaction({ emoji: '🚀' })
    await nextTick()

    expect(wrapper.findAll('.inalia-live-reaction').map(node => node.text())).toEqual(['🔥', '🎉'])
    expect(vi.getTimerCount()).toBe(2)

    await vi.advanceTimersByTimeAsync(3000)
    expect(wrapper.findAll('.inalia-live-reaction')).toHaveLength(0)

    emitLiveReaction({ emoji: '✅' })
    await nextTick()
    expect(wrapper.findAll('.inalia-live-reaction').map(node => node.text())).toEqual(['✅'])
  })

  it.each([
    { limit: 0, expected: 0 },
    { limit: -2, expected: 0 },
    { limit: 1.9, expected: 1 },
    { limit: Number.NaN, expected: 20 },
    { limit: Number.POSITIVE_INFINITY, expected: 20 },
    { limit: Number.NEGATIVE_INFINITY, expected: 20 },
    // Frontmatter is not runtime type-checked.
    { limit: '2' as unknown as number, expected: 20 },
    { limit: null as unknown as number, expected: 20 },
  ])('normalizes limit $limit to $expected', async ({ limit, expected }) => {
    const wrapper = mountComponent({ maxEmojis: limit })
    for (let i = 0; i < 25; i++) {
      emitLiveReaction({ emoji: '🔥' })
    }
    await nextTick()

    expect(wrapper.findAll('.inalia-live-reaction')).toHaveLength(expected)
    expect(vi.getTimerCount()).toBe(expected)
  })

  it('uses updated limits without resubscribing', async () => {
    const wrapper = mountComponent({ maxEmojis: 1 })
    emitLiveReaction({ emoji: '🔥' })
    await wrapper.setProps({ maxEmojis: 2 })
    emitLiveReaction({ emoji: '🎉' })
    emitLiveReaction({ emoji: '🚀' })
    await nextTick()

    expect(wrapper.findAll('.inalia-live-reaction')).toHaveLength(2)
    expect(echoPrivate).toHaveBeenCalledTimes(1)
  })

  it('also caps the existing hidden buffer while disabled', async () => {
    const wrapper = mountComponent({ disabled: true, maxEmojis: 1 })
    emitLiveReaction({ emoji: '🔥' })
    emitLiveReaction({ emoji: '🚀' })
    await wrapper.setProps({ disabled: false })

    expect(wrapper.findAll('.inalia-live-reaction').map(node => node.text())).toEqual(['🔥'])
  })

  it('does not subscribe in static mode', () => {
    const wrapper = mountComponent({ talk: null })

    expect(echoPrivate).not.toHaveBeenCalled()

    wrapper.unmount()

    expect(echoLeave).not.toHaveBeenCalled()
  })
})
