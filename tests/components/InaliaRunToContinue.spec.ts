import { describe, expect, it } from 'vitest'
import InaliaRunToContinue from '../../components/InaliaRunToContinue.vue'
import { renderComponent } from '../render'

describe('inaliaRunToContinue', () => {
  it('renders default message', async () => {
    const html = await renderComponent(InaliaRunToContinue)
    expect(html).toMatchSnapshot()
  })

  it('emits run event when button clicked', async () => {
    const wrapper = await import('@vue/test-utils').then(m => m.mount(InaliaRunToContinue))
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('run')).toBeTruthy()
  })
})
