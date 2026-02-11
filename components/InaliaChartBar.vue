<script lang="ts">
import type { DeepReadonly } from 'vue'
import type { SelectData } from '../types/data'
import { VisStackedBar, VisXYContainer } from '@unovis/vue'
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

const barWidth = 30
const barPadding = 0.1
const roundedCorners = 4

const x = (d: SelectData[number], index: number) => index
const y = (d: SelectData[number]) => d.count
const color = (d: SelectData[number]) => d.color
</script>

<template>
  <VisXYContainer :data="data" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <VisStackedBar
      :x="x"
      :y="y"
      :color="color"
      :bar-width="barWidth"
      :bar-padding="barPadding" :rounded-corners="roundedCorners"
    />
  </VisXYContainer>
</template>
