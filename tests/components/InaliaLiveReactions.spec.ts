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
    useInaliaLiveReactions: (params?: { disabled?: { value: boolean } }) => ({
      dispose: mocks.dispose,
      listen: mocks.listen,
      liveReactions: computed(() => (params?.disabled?.value ? [] : mocks.liveReactionsValue)),
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

  it('still listens and hides reactions when disabled', () => {
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

    expect(mocks.listen).toHaveBeenCalledTimes(1)
    expect(wrapper.text()).not.toContain('🔥')
    expect(mocks.dispose).not.toHaveBeenCalled()
  })
})
