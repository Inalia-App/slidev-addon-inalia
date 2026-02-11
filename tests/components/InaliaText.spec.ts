import { describe, expect, it } from 'vitest'
import InaliaText from '../../components/InaliaText.vue'
import { renderComponent } from '../render'

describe('inaliaText', () => {
  it('renders empty list when no data provided', async () => {
    const html = await renderComponent(InaliaText, {
      props: {
        data: [],
      },
    })
    expect(html).toMatchSnapshot()
  })

  it('renders single text item', async () => {
    const html = await renderComponent(InaliaText, {
      props: {
        data: ['Hello World'],
      },
    })
    expect(html).toMatchSnapshot()
  })

  it('renders multiple text items', async () => {
    const html = await renderComponent(InaliaText, {
      props: {
        data: ['First answer', 'Second answer', 'Third answer'],
      },
    })
    expect(html).toMatchSnapshot()
  })
})
