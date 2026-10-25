import { describe, expect, it } from 'vitest'
import InaliaLegend from '../../components/InaliaLegend.vue'
import { renderComponent } from '../render'

describe('inaliaLegend', () => {
  it('renders empty legend when no data', async () => {
    const html = await renderComponent(InaliaLegend, {
      props: {
        data: [],
      },
    })
    expect(html).toMatchSnapshot()
  })

  it('renders legend with single item', async () => {
    const html = await renderComponent(InaliaLegend, {
      props: {
        data: [
          { count: 5, label: 'Option A', color: '#FF0000' },
        ],
      },
    })
    expect(html).toMatchSnapshot()
  })

  it('renders legend with multiple items', async () => {
    const html = await renderComponent(InaliaLegend, {
      props: {
        data: [
          { count: 5, label: 'Option A', color: '#FF0000' },
          { count: 3, label: 'Option B', color: '#00FF00' },
          { count: 7, label: 'Option C', color: '#0000FF' },
        ],
      },
    })
    expect(html).toMatchSnapshot()
  })
})
