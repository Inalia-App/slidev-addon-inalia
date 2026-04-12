import type { Talk } from '../../types/talk'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { useInaliaStatus } from '../../composables/useInaliaStatus'

const talk: Talk = {
  id: 42,
  title: 'Testing status',
  description: 'A talk just for tests',
  color: '#6b46c1',
  scheduled_at: {
    iso: '2026-04-08T12:00:00Z',
    time_ago: 'just now',
  },
  state: {
    disabled: false,
    running: true,
    finished: false,
  },
  slidev: {
    run_to_continue: false,
  },
  urls: {
    overview: 'https://example.com/overview',
    dashboard: 'https://example.com/dashboard',
    tiny_overview: 'https://example.com/t/overview',
    tiny_feedback: 'https://example.com/t/feedback',
  },
}

let status: ReturnType<typeof useInaliaStatus>

function mountHost(providedTalk?: Talk | null) {
  const Host = defineComponent({
    setup() {
      status = useInaliaStatus()

      return () => h('div')
    },
  })

  return mount(Host, {
    global: {
      provide: {
        ...(providedTalk !== undefined ? { talk: providedTalk } : {}),
      },
    },
  })
}

describe('useInaliaStatus', () => {
  it('returns running when a talk is available', () => {
    const wrapper = mountHost(talk)

    expect(status.isRunning).toBe(true)

    wrapper.unmount()
  })

  it('returns static when no talk is available', () => {
    const wrapper = mountHost()

    expect(status.isRunning).toBe(false)

    wrapper.unmount()
  })
})
