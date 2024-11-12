<script lang="ts" setup>
import type { DeepReadonly, PropType } from 'vue'
import type { SelectData } from '../types'
import { useSlideContext } from '@slidev/client'
import { VisStackedBar, VisXYContainer } from '@unovis/vue'

defineProps({
  data: {
    required: true,
    type: Array as PropType<DeepReadonly<SelectData>>,
  },
})

const { $slidev, $frontmatter } = useSlideContext()
const inaliaConfig = $slidev.configs.inalia

const width = $frontmatter.inalia?.bar?.width
const height = $frontmatter.inalia?.bar?.height

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

const x = (d: SelectData[number], index: number) => index
const y = (d: SelectData[number]) => d.count
const color = (d: SelectData[number]) => d.color
</script>

<template>
  <VisXYContainer :data="data" :width="width" :height="height">
    <VisStackedBar
      :x="x"
      :y="y"
      :color="color"
      :bar-width="barWidth"
      :bar-padding="barPadding" :rounded-corners="roundedCorners"
    />
  </VisXYContainer>
</template>
