import { describe, expect, it } from 'vitest'
import InaliaLoading from '../../components/InaliaLoading.vue'
import { renderComponent } from '../render'

describe('inaliaLoading', () => {
  it('renders loading state', async () => {
    const html = await renderComponent(InaliaLoading)
    expect(html).toMatchSnapshot()
  })

  it('displays loading text', async () => {
    const html = await renderComponent(InaliaLoading)
    expect(html).toContain('Loading...')
  })
})
