import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import InaliaShortUrl from '../../components/InaliaShortUrl.vue'
import { renderComponent } from '../render'

describe('inaliaShortUrl', () => {
  it.each([
    ['api.inalia.app/f/QiA48c', 'https://api.inalia.app/f/QiA48c'],
    ['https://inalia.app/abc123', 'https://inalia.app/abc123'],
    ['http://inalia.app/xyz789', 'http://inalia.app/xyz789'],
    ['HTTPS://inalia.app/abc123', 'HTTPS://inalia.app/abc123'],
    ['//inalia.app/abc123', 'https://inalia.app/abc123'],
  ])('uses an absolute href for %s', (url, href) => {
    const wrapper = mount(InaliaShortUrl, { props: { url } })

    expect(wrapper.get('a').attributes('href')).toBe(href)
    expect(wrapper.text()).toBe(url.replace(/^https?:\/\//i, ''))
    wrapper.unmount()
  })

  it('updates the href when the URL changes', async () => {
    const wrapper = mount(InaliaShortUrl, { props: { url: 'inalia.app/abc123' } })

    await wrapper.setProps({ url: 'api.inalia.app/f/QiA48c' })

    expect(wrapper.get('a').attributes('href')).toBe('https://api.inalia.app/f/QiA48c')
    expect(wrapper.text()).toBe('api.inalia.app/f/QiA48c')
    wrapper.unmount()
  })

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
