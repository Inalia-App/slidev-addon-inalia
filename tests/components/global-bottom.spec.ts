import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import GlobalBottom from '../../global-bottom.vue'

const mocks = vi.hoisted(() => ({
  currentSlideRouteValue: {
    meta: { slide: { frontmatter: {} } },
  } as any,
  configs: {} as any,
  run: vi.fn(),
  talk: null as any,
}))

vi.mock('@slidev/client', async () => {
  const { computed } = await import('vue')

  return {
    useNav: () => ({
      currentSlideRoute: computed(() => mocks.currentSlideRouteValue),
    }),
    get configs() {
      return mocks.configs
    },
  }
})

vi.mock('../../composables/useInaliaTalk', () => ({
  useInaliaTalk: () => ({
    run: mocks.run,
    talk: mocks.talk,
  }),
}))

function mountComponent() {
  return mount(GlobalBottom, {
    global: {
      stubs: {
        InaliaAudienceQuestionHighlighted: true,
        InaliaLiveReactions: {
          name: 'InaliaLiveReactions',
          props: ['disabled', 'maxEmojis'],
          template: '<div data-testid="live-reactions" />',
        },
        InaliaRunToContinue: true,
      },
    },
  })
}

describe('global-bottom', () => {
  beforeEach(() => {
    mocks.configs = {}
    mocks.currentSlideRouteValue = {
      meta: { slide: { frontmatter: {} } },
    }
  })

  it.each([
    { root: undefined, slide: undefined, disabled: false, limit: undefined },
    { root: true, slide: undefined, disabled: false, limit: undefined },
    { root: false, slide: undefined, disabled: true, limit: undefined },
    { root: false, slide: true, disabled: false, limit: undefined },
    { root: false, slide: {}, disabled: false, limit: undefined },
    { root: {}, slide: undefined, disabled: false, limit: undefined },
    { root: { limit: 5 }, slide: undefined, disabled: false, limit: 5 },
    { root: { limit: 5 }, slide: false, disabled: true, limit: 5 },
    { root: { limit: 5 }, slide: true, disabled: false, limit: 5 },
    { root: { limit: 0 }, slide: undefined, disabled: false, limit: 0 },
    { root: null, slide: undefined, disabled: false, limit: undefined },
    { root: undefined, slide: false, disabled: true, limit: undefined },
  ])('resolves root $root and slide $slide', ({ root, slide, disabled, limit }) => {
    mocks.configs = { inalia: { emoji: root } }
    mocks.currentSlideRouteValue.meta.slide.frontmatter = { inalia: { emoji: slide } }

    const wrapper = mountComponent()
    const reactions = wrapper.findComponent({ name: 'InaliaLiveReactions' })

    expect(reactions.props('disabled')).toBe(disabled)
    expect(reactions.props('maxEmojis')).toBe(limit)
  })
})
