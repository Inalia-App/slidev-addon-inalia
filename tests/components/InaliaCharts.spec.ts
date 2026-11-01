import type { StaticChartDefinition } from '@tanstack/charts'
import { createChartScene, renderChartSvg } from '@tanstack/charts'
import { Chart } from '@tanstack/charts/vue'
import { shallowMount } from '@vue/test-utils'
import { TransitionPresets, usePreferredReducedMotion, useTransition } from '@vueuse/core'
import { describe, expect, it, vi } from 'vitest'
import { reactive, ref, toValue } from 'vue'
import InaliaChartBar from '../../components/InaliaChartBar.vue'
import InaliaChartDonut from '../../components/InaliaChartDonut.vue'

vi.mock('@vueuse/core', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vueuse/core')>()
  const { computed, ref } = await import('vue')
  return {
    ...actual,
    usePreferredReducedMotion: vi.fn(() => ref('reduce')),
    useTransition: vi.fn((source: () => number[]) => computed(source)),
  }
})

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

    if (_name === 'bar') {
      expect(chart.props('definition').svgAnimation).toEqual({
        duration: 450,
        easing: 'ease-out',
        respectReducedMotion: true,
        resize: false,
      })
    }

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

describe('donut animation', () => {
  it('uses interpolated counts without SVG path morphing and reacts to reduced motion', async () => {
    const motion = ref<'reduce' | 'no-preference'>('no-preference')
    const counts = ref([5, 3])
    vi.mocked(usePreferredReducedMotion).mockReturnValueOnce(motion)
    vi.mocked(useTransition).mockReturnValueOnce(counts)
    const data = reactive([
      { count: 5, label: 'First', color: '#ff0000' },
      { count: 3, label: 'Second', color: '#00ff00' },
    ])
    const wrapper = shallowMount(InaliaChartDonut, { props: { data } })
    const chart = wrapper.findComponent(Chart)
    const call = vi.mocked(useTransition).mock.calls.at(-1)!
    const options = call[1]!
    expect(options.duration).toBe(300)
    expect(options.transition).toBe(TransitionPresets.linear)
    expect(toValue(options.disabled)).toBe(false)
    expect(chart.props('definition').svgAnimation).toBeUndefined()
    const svg = () => renderChartSvg(createChartScene(chart.props('definition') as StaticChartDefinition, { width: 600, height: 300 }))
    const initial = svg()

    data[0].count = 10
    await wrapper.vm.$nextTick()
    expect(toValue(call[0])).toEqual([10, 3])
    expect(svg()).toBe(initial)

    counts.value = [7.5, 3]
    await wrapper.vm.$nextTick()
    const intermediate = svg()
    expect(intermediate).not.toBe(initial)
    expect(intermediate).not.toMatch(/NaN|Infinity/)

    counts.value = [10, 3]
    await wrapper.vm.$nextTick()
    expect(svg()).not.toBe(intermediate)

    motion.value = 'reduce'
    expect(toValue(options.disabled)).toBe(true)
    wrapper.unmount()
  })
})
