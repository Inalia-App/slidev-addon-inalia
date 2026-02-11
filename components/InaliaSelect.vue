<script lang="ts">
import type { DeepReadonly } from 'vue'
import type { SelectData } from '../types/data'
import type { ChartType } from '../types/question'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import InaliaChartBar from './InaliaChartBar.vue'
import InaliaChartDonut from './InaliaChartDonut.vue'

const inaliaSelect = tv({
  slots: {
    base: '',
  },
})

export interface InaliaSelectProps {
  chart: ChartType
  data: DeepReadonly<SelectData>
  class?: any
  ui?: Partial<typeof inaliaSelect.slots>
}
export interface InaliaSelectEmits {}
export interface InaliaSelectSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<InaliaSelectProps>()
defineEmits<InaliaSelectEmits>()
defineSlots<InaliaSelectSlots>()

const ui = computed(() => inaliaSelect())
</script>

<template>
  <InaliaChartDonut
    v-if="chart === 'donut'"
    :data="data"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  />
  <InaliaChartBar
    v-else-if="chart === 'bar'"
    :data="data"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  />
</template>
