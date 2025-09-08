<script lang="ts" setup>
import type { DeepReadonly, PropType } from 'vue'
import type { SelectData } from '../types/data'
import { VisStackedBar, VisXYContainer } from '@unovis/vue'

defineProps({
  data: {
    required: true,
    type: Array as PropType<DeepReadonly<SelectData>>,
  },
})

const barWidth = 30
const barPadding = 0.1
const roundedCorners = 4

const x = (d: SelectData[number], index: number) => index
const y = (d: SelectData[number]) => d.count
const color = (d: SelectData[number]) => d.color
</script>

<template>
  <VisXYContainer :data="data">
    <VisStackedBar
      :x="x"
      :y="y"
      :color="color"
      :bar-width="barWidth"
      :bar-padding="barPadding" :rounded-corners="roundedCorners"
    />
  </VisXYContainer>
</template>
