import { describe, expect, it } from 'vitest'
import InaliaOverviewLayout from '../../layouts/inalia-overview.vue'
import { renderComponent } from '../render'
import { mockTalk } from './mock'

describe('inalia-overview layout', () => {
  it('renders overview layout without talk data', async () => {
    const html = await renderComponent(InaliaOverviewLayout, {
      props: {},
    })
    expect(html).toMatchSnapshot()
  })

  it('renders overview layout with talk data', async () => {
    const html = await renderComponent(InaliaOverviewLayout, {
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
