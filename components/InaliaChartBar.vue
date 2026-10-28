<script lang="ts">
import type { DeepReadonly } from 'vue'
import type { SelectData } from '../types/data'
import { barY, defineChart } from '@tanstack/charts'
import { scaleBand } from '@tanstack/charts/scales/band'
import { scaleLinear } from '@tanstack/charts/scales/linear'
import { Chart } from '@tanstack/charts/vue'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const inaliaChartBar = tv({
  slots: {
    base: '',
  },
})

export interface InaliaChartBarProps {
  data: DeepReadonly<SelectData>
  class?: any
  ui?: Partial<typeof inaliaChartBar.slots>
}
export interface InaliaChartBarEmits {}
export interface InaliaChartBarSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<InaliaChartBarProps>()
defineEmits<InaliaChartBarEmits>()
defineSlots<InaliaChartBarSlots>()

const ui = computed(() => inaliaChartBar())

const definition = computed(() => defineChart({
  marks: [
    barY(props.data.map(d => ({ ...d })), {
      x: (_datum, { index }) => index,
      y: 'count',
      fill: d => d.color,
      maxThickness: 30,
      radius: 4,
    }),
  ],
  scales: {
    x: { scale: () => scaleBand<number>().padding(0.1), axis: false },
    y: { scale: scaleLinear, axis: false },
  },
  margin: 0,
}))
</script>

<template>
  <Chart
    :definition="definition"
    :height="300"
    aria-label="Audience response counts"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  />
</template>
