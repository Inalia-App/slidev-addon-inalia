import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import InaliaLegend from '../../components/InaliaLegend.vue'

describe('inaliaLegend', () => {
  it('renders an empty list when there is no data', () => {
    const wrapper = mount(InaliaLegend, { props: { data: [] } })
    expect(wrapper.attributes('role')).toBe('list')
    expect(wrapper.findAll('[role="listitem"]')).toHaveLength(0)
    wrapper.unmount()
  })

  it('renders option counts, labels and matching color bullets', async () => {
    const wrapper = mount(InaliaLegend, {
      props: {
        data: [
          { count: 5, label: 'Option A', color: '#FF0000' },
          { count: 3, label: 'Option B', color: '#00FF00' },
        ],
        class: 'custom-legend',
        ui: { base: 'custom-base' },
      },
    })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['custom-legend', 'custom-base']))
    expect(wrapper.findAll('[role="listitem"]').map(item => item.text())).toEqual(['5 - Option A', '3 - Option B'])
    expect(wrapper.find('.inalia-legend-bullet').attributes('style')).toContain('background-color: rgb(255, 0, 0)')
    expect(wrapper.find('.inalia-legend-bullet').attributes('aria-hidden')).toBe('true')

    await wrapper.setProps({ data: [{ count: 9, label: '<strong>Option A</strong>', color: '#0000FF' }] })
    expect(wrapper.findAll('[role="listitem"]')).toHaveLength(1)
    expect(wrapper.text()).toBe('9 - <strong>Option A</strong>')
    expect(wrapper.find('strong').exists()).toBe(false)
    expect(wrapper.find('.inalia-legend-bullet').attributes('style')).toContain('background-color: rgb(0, 0, 255)')
    wrapper.unmount()
  })
})
