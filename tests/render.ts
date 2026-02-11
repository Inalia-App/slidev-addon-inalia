import type { Component } from 'vue'
import { mount } from '@vue/test-utils'

/**
 * Helper function to mount a Vue component and return its HTML for snapshot testing.
 * Inspired by Nuxt UI's component-render pattern.
 *
 * @param component - The Vue component to mount
 * @param options - Mount options (props, slots, global config, etc.)
 * @returns The rendered HTML string
 */
export async function renderComponent(
  component: Component,
  options: Parameters<typeof mount>[1] = {},
): Promise<string> {
  const wrapper = mount(component, options)
  await wrapper.vm.$nextTick()
  return wrapper.html()
}
