import type { Talk } from '../../types/talk'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { useInaliaTalk } from '../../composables/useInaliaTalk'
import { mockTalk } from '../layouts/mock'

const { startDemoMode, stopDemoMode, reload } = vi.hoisted(() => ({
  startDemoMode: vi.fn(),
  stopDemoMode: vi.fn(),
  reload: vi.fn(),
}))

vi.mock('../../utils/api', () => ({
  runTalk: vi.fn(),
  startDemoMode,
  stopDemoMode,
}))

beforeEach(() => {
  vi.resetAllMocks()
  vi.stubGlobal('window', { location: { reload } })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function mountHost(talk: Talk | null, username?: string) {
  let controls!: ReturnType<typeof useInaliaTalk>
  const wrapper = mount(defineComponent({
    setup() {
      controls = useInaliaTalk()
      return () => h('div')
    },
  }), { global: { provide: { talk, username } } })
  return { controls, wrapper }
}

describe('useInaliaTalk demo mode', () => {
  it.each([false, true])('toggles demo mode from %s and reloads after success', async (demoMode) => {
    const { controls, wrapper } = mountHost({ ...mockTalk, demo_mode: demoMode }, 'token-owner')
    const request = demoMode ? stopDemoMode : startDemoMode
    let complete!: () => void
    request.mockImplementationOnce(() => new Promise<void>((resolve) => {
      complete = resolve
    }))

    const pending = controls.toggleDemoMode()
    expect(request).toHaveBeenCalledExactlyOnceWith('token-owner')
    expect(demoMode ? startDemoMode : stopDemoMode).not.toHaveBeenCalled()
    expect(reload).not.toHaveBeenCalled()

    complete()
    await pending
    expect(reload).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it.each([false, true])('does not reload when toggling from %s fails', async (demoMode) => {
    const { controls, wrapper } = mountHost({ ...mockTalk, demo_mode: demoMode }, 'token-owner')
    const error = new Error('Forbidden')
    const request = demoMode ? stopDemoMode : startDemoMode
    request.mockRejectedValueOnce(error)

    await expect(controls.toggleDemoMode()).rejects.toBe(error)
    expect(reload).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it.each([
    { talk: null, username: 'token-owner' },
    { talk: mockTalk, username: undefined },
  ])('rejects uninitialized connections: %j', async ({ talk, username }) => {
    const { controls, wrapper } = mountHost(talk, username)

    await expect(controls.toggleDemoMode()).rejects.toThrow('Inalia account has not been initialized.')
    expect(startDemoMode).not.toHaveBeenCalled()
    expect(stopDemoMode).not.toHaveBeenCalled()
    expect(reload).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})
