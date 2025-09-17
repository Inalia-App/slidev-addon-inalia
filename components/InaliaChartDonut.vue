<script lang="ts" setup>
import type { DeepReadonly, PropType } from 'vue'
import type { SelectData } from '../types/data'
import { VisDonut, VisSingleContainer } from '@unovis/vue'

defineProps({
  data: {
    required: true,
    type: Array as PropType<DeepReadonly<SelectData>>,
  },
})

const cornerRadius = 4
const padAngle = 0.04
const arcWidth = 30
const showBackground = false

const value = (d: SelectData[number]) => d.count
const color = (d: SelectData[number]) => d.color
</script>

<template>
  <VisSingleContainer :data="data">
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
