import { describe, expect, it } from 'vitest'
import InaliaDefaultLayout from '../../components/InaliaDefaultLayout.vue'
import { renderComponent } from '../render'

describe('inaliaDefaultLayout', () => {
  it('renders layout without QR code when no url', async () => {
    const html = await renderComponent(InaliaDefaultLayout, {
      props: {
        question: 'What is your favorite color?',
      },
      slots: {
        default: '<div class="test-content">Test Content</div>',
      },
    })
    expect(html).toMatchSnapshot()
  })

  it('renders layout with QR code when url provided', async () => {
    const html = await renderComponent(InaliaDefaultLayout, {
      props: {
        question: 'What is your favorite color?',
        url: 'https://inalia.app/abc123',
      },
      slots: {
        default: '<div class="test-content">Test Content</div>',
      },
    })
    expect(html).toMatchSnapshot()
  })

  it('renders layout with QR code but without url text when showUrl is false', async () => {
    const html = await renderComponent(InaliaDefaultLayout, {
      props: {
        question: 'What is your favorite color?',
        url: 'https://inalia.app/abc123',
        showUrl: false,
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
        question: 'What is your favorite color?',
      },
      slots: {
        title: '<h2 class="custom-title">Custom Title</h2>',
        default: '<div class="test-content">Test Content</div>',
      },
    })
    expect(html).toMatchSnapshot()
  })
})
