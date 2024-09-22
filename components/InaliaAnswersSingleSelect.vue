<script lang="ts" setup>
import type { Answer } from '../types/answer'
import { VisBulletLegend, VisDonut, VisSingleContainer } from '@unovis/vue'
import { computed, type PropType } from 'vue'

const props = defineProps({
  answers: {
    required: true,
    type: Array as PropType<Answer<'single_select'>[]>,
  },
})

const value = (d: Answer<'single_select'>) => d.value.value
const items = computed(() => props.answers.map(d => ({ name: d.value.label })))
</script>

<template>
  <VisSingleContainer :data="answers" class="h-full mb-4">
    <VisDonut :value="value" :corner-radius="4" :pad-angle="0.04" :show-background="false" />
  </VisSingleContainer>

  <!-- TODO: use a var css -->
  <VisBulletLegend :items="items" label-font-size="1.125rem" class="self-center" />
</template>
