import { describe, expect, it } from 'vitest'
import InaliaShortUrl from '../../components/InaliaShortUrl.vue'
import { renderComponent } from '../render'

describe('inaliaShortUrl', () => {
  it('renders short URL with https protocol', async () => {
    const html = await renderComponent(InaliaShortUrl, {
      props: {
        url: 'https://inalia.app/abc123',
      },
    })
    expect(html).toMatchSnapshot()
  })

  it('renders short URL with http protocol', async () => {
    const html = await renderComponent(InaliaShortUrl, {
      props: {
        url: 'http://inalia.app/xyz789',
      },
    })
    expect(html).toMatchSnapshot()
  })

  it('renders URL as link with target blank', async () => {
    const html = await renderComponent(InaliaShortUrl, {
      props: {
        url: 'https://example.com/test',
      },
    })
    expect(html).toMatchSnapshot()
  })
})
