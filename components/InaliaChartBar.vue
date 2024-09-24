<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Answer } from '../types'
import { useSlideContext } from '@slidev/client'
import { VisStackedBar, VisXYContainer } from '@unovis/vue'

defineProps({
  answers: {
    required: true,
    type: Array as PropType<Answer<'single_select'>[]>,
  },
})

const { $slidev, $frontmatter } = useSlideContext()
const inaliaConfig = $slidev.configs.inalia

const barWidth
  = $frontmatter.inalia?.bar?.barWidth
  ?? inaliaConfig?.bar?.barWidth
  ?? 30

const barPadding
  = $frontmatter.inalia?.bar?.barPadding
  ?? inaliaConfig?.bar?.barPadding
  ?? 0.1

const roundedCorners
  = $frontmatter.inalia?.bar?.roundedCorners
  ?? inaliaConfig?.bar?.roundedCorners
  ?? 4

const x = (d: Answer<'single_select'>, index: number) => index
const y = (d: Answer<'single_select'>) => d.value
const color = (d: Answer<'single_select'>) => d.color
</script>

<template>
  <VisXYContainer :data="answers">
    <VisStackedBar
      :x="x"
      :y="y"
      :color="color"
      :bar-width="barWidth"
      :bar-padding="barPadding" :rounded-corners="roundedCorners"
    />
  </VisXYContainer>
</template>
