<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Answer } from '../types/answer'
import { useSlideContext } from '@slidev/client'
import { VisDonut, VisSingleContainer } from '@unovis/vue'

defineProps({
  answers: {
    required: true,
    type: Array as PropType<Answer<'single_select'>[]>,
  },
})

const { $slidev, $frontmatter } = useSlideContext()
const inaliaConfig = $slidev.configs.inalia

const width = $frontmatter.inalia?.donut?.width
const height = $frontmatter.inalia?.donut?.height

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

const value = (d: Answer<'single_select'>) => d.value
const color = (d: Answer<'single_select'>) => d.color
</script>

<template>
  <VisSingleContainer :data="answers" :width="width" :height="height">
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
