import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import InaliaLiveReactions from '../../components/InaliaLiveReactions.vue'

const mocks = vi.hoisted(() => ({
  dispose: vi.fn(),
  listen: vi.fn(),
  liveReactionsValue: [] as Array<{
    emoji: string
    id: string
    position: { x: number, y: number }
    scale: number
  }>,
}))

vi.mock('../../composables/useInaliaLiveReactions', async () => {
  const { computed } = await import('vue')

  return {
    useInaliaLiveReactions: () => ({
      dispose: mocks.dispose,
      listen: mocks.listen,
      liveReactions: computed(() => mocks.liveReactionsValue),
    }),
  }
})

describe('inaliaLiveReactions', () => {
  it('listens and renders reactions when enabled', () => {
    mocks.listen.mockClear()
    mocks.dispose.mockClear()
    mocks.liveReactionsValue = [
      {
        emoji: '🔥',
        id: 'reaction-1',
        position: { x: 10, y: 20 },
        scale: 1,
      },
    ]

    const wrapper = mount(InaliaLiveReactions)

    expect(mocks.listen).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).toContain('🔥')
  })

  it('skips listening and hides reactions when disabled', () => {
    mocks.listen.mockClear()
    mocks.dispose.mockClear()
    mocks.liveReactionsValue = [
      {
        emoji: '🔥',
        id: 'reaction-1',
        position: { x: 10, y: 20 },
        scale: 1,
      },
    ]

    const wrapper = mount(InaliaLiveReactions, {
      props: {
        disabled: true,
      },
    })

    expect(mocks.listen).not.toHaveBeenCalled()
    expect(wrapper.text()).not.toContain('🔥')
    expect(wrapper.html()).toBe('<!--v-if-->')
  })
})
