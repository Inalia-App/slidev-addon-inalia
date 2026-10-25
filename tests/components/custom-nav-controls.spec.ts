import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import CustomNavControls from '../../custom-nav-controls.vue'
import { mockTalk } from '../layouts/mock'

const { toggleDemoMode } = vi.hoisted(() => ({ toggleDemoMode: vi.fn() }))

vi.mock('../../utils/api', () => ({
  runTalk: vi.fn(),
  startDemoMode: vi.fn(),
  stopDemoMode: vi.fn(),
}))

vi.mock('../../composables/useInaliaTalk', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../composables/useInaliaTalk')>()
  return {
    useInaliaTalk: () => ({ ...original.useInaliaTalk(), toggleDemoMode }),
  }
})

beforeEach(() => {
  toggleDemoMode.mockReset()
})

describe('demo navigation control', () => {
  it.each([false, true])('labels and toggles demo mode when enabled is %s', async (demoMode) => {
    const wrapper = mount(CustomNavControls, {
      global: { provide: { talk: { ...mockTalk, demo_mode: demoMode } } },
    })
    const button = wrapper.get('button')

    expect(button.attributes('title')).toBe(demoMode ? 'Exit Demo Mode' : 'Enter Demo Mode')
    expect(button.attributes('aria-pressed')).toBe(String(demoMode))
    await button.trigger('click')
    expect(toggleDemoMode).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('has no demo control in static mode', () => {
    const wrapper = mount(CustomNavControls)
    expect(wrapper.find('button').exists()).toBe(false)
    wrapper.unmount()
  })
})
