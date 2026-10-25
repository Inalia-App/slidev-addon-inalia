<script lang="ts">
import type { SelectData } from '../types/data'
import { VisBulletLegend } from '@unovis/vue'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const inaliaLegend = tv({
  slots: {
    base: 'inalia inalia-legend',
  },
})

export interface InaliaLegendProps {
  data: SelectData
  class?: any
  ui?: Partial<typeof inaliaLegend.slots>
}
export interface InaliaLegendEmits {}
export interface InaliaLegendSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<InaliaLegendProps>()
defineEmits<InaliaLegendEmits>()
defineSlots<InaliaLegendSlots>()

const ui = computed(() => inaliaLegend())

const items = computed(() => props.data.map(d => ({ name: `${d.count} - ${d.label}`, color: d.color })))
</script>

<template>
  <VisBulletLegend :items="items" :class="ui.base({ class: [props.ui?.base, props.class] })" label-class-name="inalia inalia-legend-text" />
</template>
