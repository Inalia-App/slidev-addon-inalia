import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import GlobalBottom from '../../global-bottom.vue'

const mocks = vi.hoisted(() => ({
  currentSlideRouteValue: {
    meta: {
      slide: {
        frontmatter: {},
      },
    },
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

describe('global-bottom', () => {
  it('passes disabled=false to live reactions by default', () => {
    mocks.currentSlideRouteValue = {
      meta: {
        slide: {
          frontmatter: {},
        },
      },
    }

    const wrapper = mount(GlobalBottom, {
      global: {
        stubs: {
          InaliaAudienceQuestionHighlighted: true,
          InaliaLiveReactions: {
            props: ['disabled'],
            template: '<div data-testid="live-reactions">{{ disabled }}</div>',
          },
          InaliaRunToContinue: true,
        },
      },
    })

    expect(wrapper.get('[data-testid="live-reactions"]').text()).toBe('false')
  })

  it('passes disabled=true when slide frontmatter sets inalia.emoji to false', () => {
    mocks.currentSlideRouteValue = {
      meta: {
        slide: {
          frontmatter: {
            inalia: {
              emoji: false,
            },
          },
        },
      },
    }

    const wrapper = mount(GlobalBottom, {
      global: {
        stubs: {
          InaliaAudienceQuestionHighlighted: true,
          InaliaLiveReactions: {
            props: ['disabled'],
            template: '<div data-testid="live-reactions">{{ disabled }}</div>',
          },
          InaliaRunToContinue: true,
        },
      },
    })

    expect(wrapper.get('[data-testid="live-reactions"]').text()).toBe('true')
  })

  it('passes maxEmojis from root front matter configs to live reactions', () => {
    mocks.currentSlideRouteValue = {
      meta: {
        slide: {
          frontmatter: {},
        },
      },
    }
    mocks.configs = { inalia: { emojiLimit: 5 } }

    const wrapper = mount(GlobalBottom, {
      global: {
        stubs: {
          InaliaAudienceQuestionHighlighted: true,
          InaliaLiveReactions: {
            props: ['maxEmojis'],
            template: '<div data-testid="live-reactions">{{ maxEmojis }}</div>',
          },
          InaliaRunToContinue: true,
        },
      },
    })

    expect(wrapper.get('[data-testid="live-reactions"]').text()).toBe('5')

    mocks.configs = {}
  })
})
