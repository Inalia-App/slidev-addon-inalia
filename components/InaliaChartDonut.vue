<script lang="ts">
import type { DeepReadonly } from 'vue'
import type { SelectData } from '../types/data'
import { VisDonut, VisSingleContainer } from '@unovis/vue'
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

const cornerRadius = 4
const padAngle = 0.04
const arcWidth = 30
const showBackground = false

const value = (d: SelectData[number]) => d.count
const color = (d: SelectData[number]) => d.color
</script>

<template>
  <VisSingleContainer :data="data" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <VisDonut
      :value="value"
      :color="color"
      :corner-radius="cornerRadius"
      :pad-angle="padAngle"
      :arc-width="arcWidth"
      :show-background="showBackground"
    />
  </VisSingleContainer>
</template>
