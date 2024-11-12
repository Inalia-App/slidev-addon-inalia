<script lang="ts" setup>
import type { DeepReadonly, PropType } from 'vue'
import type { ChartType, SelectData } from '../types'
import InaliaChartBar from './InaliaChartBar.vue'
import InaliaChartDonut from './InaliaChartDonut.vue'

defineProps({
  chart: {
    required: true,
    type: String as PropType<ChartType>,
  },
  data: {
    required: true,
    type: Array as PropType<DeepReadonly<SelectData>>,
  },
})
</script>

<template>
  <InaliaChartDonut
    v-if="chart === 'donut'"
    :data="data"
  />
  <InaliaChartBar
    v-else-if="chart === 'bar'"
    :data="data"
  />
</template>
