<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Answer } from '../types/answer'
import { VisBulletLegend } from '@unovis/vue'
import { computed } from 'vue'

const props = defineProps({
  answers: {
    required: true,
    type: Array as PropType<Answer<'single_select'>[]>,
  },
})

const items = computed(() => props.answers.map(d => ({ name: `${d.value} - ${d.label}`, color: d.color })))
</script>

<template>
  <VisBulletLegend :items="items" label-class-name="inalia inalia-legend" />
</template>
