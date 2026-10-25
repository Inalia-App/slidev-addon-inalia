import { describe, expect, it } from 'vitest'
import InaliaPoweredBy from '../../components/InaliaPoweredBy.vue'
import { renderComponent } from '../render'

describe('inaliaPoweredBy', () => {
  it('renders Powered by Inalia link', async () => {
    const html = await renderComponent(InaliaPoweredBy)
    expect(html).toMatchSnapshot()
  })

  it('contains Inalia branding', async () => {
    const html = await renderComponent(InaliaPoweredBy)
    expect(html).toContain('Powered by')
    expect(html).toContain('Inalia')
    expect(html).toContain('https://inalia.app')
  })
})
