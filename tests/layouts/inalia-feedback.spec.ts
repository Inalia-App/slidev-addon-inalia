import { describe, expect, it } from 'vitest'
import InaliaFeedbackLayout from '../../layouts/inalia-feedback.vue'
import { renderComponent } from '../render'
import { mockTalk } from './mock'

describe('inalia-feedback layout', () => {
  it('renders feedback layout without talk data', async () => {
    const html = await renderComponent(InaliaFeedbackLayout, {
      props: {},
    })
    expect(html).toMatchSnapshot()
  })

  it('renders feedback layout with talk data', async () => {
    const html = await renderComponent(InaliaFeedbackLayout, {
      props: {},
      global: {
        provide: {
          talk: mockTalk,
        },
      },
    })
    expect(html).toMatchSnapshot()
  })
})
