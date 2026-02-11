<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const inaliaPoweredBy = tv({
  slots: {
    base: 'border-0!',
    container: 'flex text-xs flex-row items-center gap-1',
    image: 'size-4',
  },
})

export interface InaliaPoweredByProps {
  class?: any
  ui?: Partial<typeof inaliaPoweredBy.slots>
}
export interface InaliaPoweredByEmits {}
export interface InaliaPoweredBySlots {}
</script>

<script lang="ts" setup>
const props = defineProps<InaliaPoweredByProps>()
defineEmits<InaliaPoweredByEmits>()
defineSlots<InaliaPoweredBySlots>()

const ui = computed(() => inaliaPoweredBy())
</script>

<template>
  <a href="https://inalia.app" target="_blank" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <span :class="ui.container({ class: props.ui?.container })">
      Powered by
      Inalia
      <img src="https://inalia.app/favicon.svg" alt="Inalia Logo" :class="ui.image({ class: props.ui?.image })">
    </span>
  </a>
</template>
