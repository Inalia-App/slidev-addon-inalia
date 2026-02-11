import { describe, expect, it } from 'vitest'
import InaliaQR from '../../components/InaliaQR.vue'
import { renderComponent } from '../render'

describe('inaliaQR', () => {
  it('renders QR code for URL', async () => {
    const html = await renderComponent(InaliaQR, {
      props: {
        url: 'https://inalia.app/test',
      },
    })
    expect(html).toMatchSnapshot()
  })

  it('renders QR code as clickable link', async () => {
    const html = await renderComponent(InaliaQR, {
      props: {
        url: 'https://example.com/qr',
      },
    })
    // Should contain link with target blank
    expect(html).toContain('target="_blank"')
    expect(html).toContain('https://example.com/qr')
  })
})
