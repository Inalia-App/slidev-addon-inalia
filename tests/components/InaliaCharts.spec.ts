import type { StaticChartDefinition } from '@tanstack/charts'
import { createChartScene, renderChartSvg } from '@tanstack/charts'
import { Chart } from '@tanstack/charts/vue'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { reactive } from 'vue'
import InaliaChartBar from '../../components/InaliaChartBar.vue'
import InaliaChartDonut from '../../components/InaliaChartDonut.vue'

describe.each([
  ['bar', InaliaChartBar],
  ['donut', InaliaChartDonut],
] as const)('inalia %s chart', (_name, component) => {
  it('preserves option colors, duplicate labels, styling and reactive updates', async () => {
    const data = reactive([
      { count: 5, label: 'Same label', color: '#ff0000' },
      { count: 3, label: 'Same label', color: '#00ff00' },
    ])
    const wrapper = shallowMount(component, {
      props: { data, class: 'custom-chart', ui: { base: 'custom-base' } },
    })
    const chart = wrapper.findComponent(Chart)
    const scene = () => createChartScene(chart.props('definition') as StaticChartDefinition, { width: 600, height: 300 })
    const svg = () => renderChartSvg(scene(), { ariaLabel: 'Results' })

    expect(chart.classes()).toEqual(expect.arrayContaining(['custom-chart', 'custom-base']))
    expect(chart.props('ariaLabel')).toContain('Audience response')
    expect(scene().points).toHaveLength(2)
    expect(svg()).toContain('#ff0000')
    expect(svg()).toContain('#00ff00')

    const previousDefinition = chart.props('definition')
    data[0].count = 10
    data[0].color = '#0000ff'
    await wrapper.vm.$nextTick()
    expect(chart.props('definition')).not.toBe(previousDefinition)
    expect(svg()).toContain('#0000ff')
    expect(svg()).not.toContain('#ff0000')

    await wrapper.setProps({ data: [{ count: 2, label: 'New option', color: '#ffff00' }] })
    expect(scene().points).toHaveLength(1)
    expect(svg()).toContain('#ffff00')
    wrapper.unmount()
  })

  it.each([
    { data: [] },
    { data: [{ count: 0, label: 'No votes', color: '#ff0000' }] },
  ])('handles empty or zero-vote data: $data', ({ data }) => {
    const wrapper = shallowMount(component, { props: { data } })
    const definition = wrapper.findComponent(Chart).props('definition') as StaticChartDefinition
    const scene = createChartScene(definition, { width: 600, height: 300 })
    const svg = renderChartSvg(scene, { ariaLabel: 'Results' })
    expect(svg).not.toMatch(/NaN|Infinity/)
    wrapper.unmount()
  })
})
