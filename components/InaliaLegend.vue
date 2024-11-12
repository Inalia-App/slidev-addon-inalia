<script lang="ts" setup>
import type { PropType } from 'vue'
import type { SelectData } from '../types'
import { VisBulletLegend } from '@unovis/vue'
import { computed } from 'vue'

const props = defineProps({
  data: {
    required: true,
    type: Array as PropType<SelectData>,
  },
})

const items = computed(() => props.data.map(d => ({ name: `${d.count} - ${d.label}`, color: d.color })))
</script>

<template>
  <VisBulletLegend :items="items" class="inalia inalia-legend" label-class-name="inalia inalia-legend-text" />
</template>
