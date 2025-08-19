<script lang="ts" setup>
import type { DeepReadonly, PropType } from 'vue'
import type { TextData } from '../types/data'

defineProps({
  data: {
    required: true,
    type: Array as PropType<DeepReadonly<TextData>>,
  },
})
</script>

<template>
  <ul
    class="inalia inalia-data-text flex gap-x-8 gap-y-2 flex-wrap"
  >
    <li v-for="(answer, index) in data" :key="index">
      {{ answer }}
    </li>
  </ul>
</template>
