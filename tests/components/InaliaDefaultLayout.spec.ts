import { describe, expect, it } from 'vitest'
import InaliaDefaultLayout from '../../components/InaliaDefaultLayout.vue'
import InaliaPoweredBy from '../../components/InaliaPoweredBy.vue'
import { renderComponent } from '../render'

describe('inaliaDefaultLayout', () => {
  const mockQuestion = {
    id: 1,
    number: 1,
    question: 'What is your favorite color?',
    tiny_url: '',
    type: 'single_select' as const,
    options: {
      label: 'Select one',
      placeholder: 'Choose an option',
      selection_type: 'single_select' as const,
      chart_type: 'bar' as const,
      choices: [],
    },
    answers: [],
  }

  it('renders layout without QR code when no tiny_url', async () => {
    const html = await renderComponent(InaliaDefaultLayout, {
      props: {
        question: mockQuestion,
      },
      global: {
        components: {
          InaliaPoweredBy,
        },
      },
      slots: {
        default: '<div class="test-content">Test Content</div>',
      },
    })
    expect(html).toMatchSnapshot()
  })

  it('renders layout with QR code when tiny_url provided', async () => {
    const html = await renderComponent(InaliaDefaultLayout, {
      props: {
        question: {
          ...mockQuestion,
          tiny_url: 'https://inalia.app/abc123',
        },
      },
      global: {
        components: {
          InaliaPoweredBy,
        },
      },
      slots: {
        default: '<div class="test-content">Test Content</div>',
      },
    })
    expect(html).toMatchSnapshot()
  })

  it('renders custom title slot', async () => {
    const html = await renderComponent(InaliaDefaultLayout, {
      props: {
        question: mockQuestion,
      },
      global: {
        components: {
          InaliaPoweredBy,
        },
      },
      slots: {
        title: '<h2 class="custom-title">Custom Title</h2>',
        default: '<div class="test-content">Test Content</div>',
      },
    })
    expect(html).toMatchSnapshot()
  })
})
