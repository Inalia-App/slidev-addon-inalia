<script lang="ts">
import type { DeepReadonly } from 'vue'
import type { SelectData } from '../types/data'
import { defineChart } from '@tanstack/charts'
import { pie, polar, radialArc } from '@tanstack/charts/polar'
import { Chart } from '@tanstack/charts/vue'
import { TransitionPresets, usePreferredReducedMotion, useTransition } from '@vueuse/core'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const inaliaChartDonut = tv({
  slots: {
    base: '',
  },
})

export interface InaliaChartDonutProps {
  data: DeepReadonly<SelectData>
  class?: any
  ui?: Partial<typeof inaliaChartDonut.slots>
}
export interface InaliaChartDonutEmits {}
export interface InaliaChartDonutSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<InaliaChartDonutProps>()
defineEmits<InaliaChartDonutEmits>()
defineSlots<InaliaChartDonutSlots>()

const ui = computed(() => inaliaChartDonut())

const reducedMotion = usePreferredReducedMotion()
// Interpolate counts, not SVG paths, to keep the ring circular during updates.
const counts = useTransition(() => props.data.map(d => d.count), {
  duration: 300,
  transition: TransitionPresets.linear,
  disabled: computed(() => reducedMotion.value === 'reduce'),
})
const data = computed(() => props.data.map((d, index) => ({
  ...d,
  choiceKey: index,
  count: Math.max(0, counts.value[index] ?? d.count),
})))

const definition = computed(() => defineChart({
  marks: [
    polar({
      marks: [
        radialArc(pie(data.value, { value: 'count', gapAngle: 0.04 }), {
          key: 'choiceKey',
          innerRadius: ({ radius }) => Math.max(0, radius - 30),
          cornerRadius: 4,
          fill: d => d.color,
        }),
      ],
      scales: { angle: null, radius: null },
    }),
  ],
  scales: { x: null, y: null },
  margin: 0,
}))
</script>

<template>
  <Chart
    :definition="definition"
    :height="300"
    aria-label="Audience response proportions"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  />
</template>
