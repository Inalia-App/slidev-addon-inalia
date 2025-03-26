<script lang="ts" setup>
import type { DeepReadonly, PropType } from 'vue'
import type { SelectData } from '../types'
import { useSlideContext } from '@slidev/client'
import { VisDonut, VisSingleContainer } from '@unovis/vue'

defineProps({
  data: {
    required: true,
    type: Array as PropType<DeepReadonly<SelectData>>,
  },
})

const { $slidev, $frontmatter } = useSlideContext()
const inaliaConfig = $slidev.configs.inalia

const width = $frontmatter.inalia?.donut?.width
const height = $frontmatter.inalia?.donut?.height

// TODO: create an helper function
const cornerRadius
  = $frontmatter.inalia?.donut?.cornerRadius
    ?? inaliaConfig?.donut?.cornerRadius
    ?? 4

const padAngle
  = $frontmatter.inalia?.donut?.padAngle
    ?? inaliaConfig?.donut?.padAngle
    ?? 0.04

const arcWidth
  = $frontmatter.inalia?.donut?.arcWidth
    ?? inaliaConfig?.donut?.arcWidth
    ?? 30

const showBackground
  = $frontmatter.inalia?.donut?.showBackground
    ?? inaliaConfig?.donut?.showBackground
    ?? false

const value = (d: SelectData[number]) => d.count
const color = (d: SelectData[number]) => d.color
</script>

<template>
  <VisSingleContainer :data="data" :width="width" :height="height">
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
