<script lang="ts">
import type { SelectData } from '../types/data'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const inaliaLegend = tv({
  slots: {
    base: 'inalia inalia-legend',
  },
})

export interface InaliaLegendProps {
  data: SelectData
  class?: any
  ui?: Partial<typeof inaliaLegend.slots>
}
export interface InaliaLegendEmits {}
export interface InaliaLegendSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<InaliaLegendProps>()
defineEmits<InaliaLegendEmits>()
defineSlots<InaliaLegendSlots>()

const ui = computed(() => inaliaLegend())
</script>

<template>
  <div role="list" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <div v-for="(item, index) in data" :key="index" role="listitem" class="inalia-legend-item">
      <span class="inalia-legend-bullet" :style="{ backgroundColor: item.color }" aria-hidden="true" />
      <span class="inalia inalia-legend-text">{{ item.count }} - {{ item.label }}</span>
    </div>
  </div>
</template>
