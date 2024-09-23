<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Answer } from '../types/answer'
import { VisDonut, VisSingleContainer } from '@unovis/vue'

defineProps({
  answers: {
    required: true,
    type: Array as PropType<Answer<'single_select'>[]>,
  },
})

const value = (d: Answer<'single_select'>) => d.value
const color = (d: Answer<'single_select'>) => d.color
</script>

<template>
  <VisSingleContainer :data="answers">
    <!-- TODO: passer de la config via le frontmatter principale -->
    <VisDonut :value="value" :color="color" :corner-radius="4" :pad-angle="0.04" :arc-width="30" :show-background="false" />
  </VisSingleContainer>
</template>
