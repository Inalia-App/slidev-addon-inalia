<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Answer, ChartType } from '../types'
import InaliaChartBar from './InaliaChartBar.vue'
import InaliaChartDonut from './InaliaChartDonut.vue'

defineProps({
  chart: {
    required: true,
    type: String as PropType<ChartType>,
  },
  answers: {
    required: true,
    type: Array as PropType<Answer<'single_select'>[]>,
  },
})
</script>

<template>
  <InaliaChartDonut
    v-if="chart === 'donut'"
    :answers="answers"
  />
  <InaliaChartBar
    v-else-if="chart === 'bar'"
    :answers="answers"
  />
</template>
