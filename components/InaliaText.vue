<script lang="ts">
import type { DeepReadonly } from 'vue'
import type { TextData } from '../types/data'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const inaliaText = tv({
  slots: {
    base: 'inalia inalia-data-text flex gap-x-8 gap-y-2 flex-wrap',
    item: '',
  },
})

export interface InaliaTextProps {
  data: DeepReadonly<TextData>
  class?: any
  ui?: Partial<typeof inaliaText.slots>
}
export interface InaliaTextEmits {}
export interface InaliaTextSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<InaliaTextProps>()
defineEmits<InaliaTextEmits>()
defineSlots<InaliaTextSlots>()

const ui = computed(() => inaliaText())
</script>

<template>
  <ul :class="ui.base({ class: [props.ui?.base, props.class] })">
    <li v-for="(answer, index) in data" :key="index" :class="ui.item({ class: props.ui?.item })">
      {{ answer }}
    </li>
  </ul>
</template>
