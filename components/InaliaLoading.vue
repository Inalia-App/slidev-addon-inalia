<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const inaliaLoading = tv({
  slots: {
    base: 'h-full flex w-full items-center justify-center',
  },
})

export interface InaliaLoadingProps {
  class?: any
  ui?: Partial<typeof inaliaLoading.slots>
}
export interface InaliaLoadingEmits {}
export interface InaliaLoadingSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<InaliaLoadingProps>()
defineEmits<InaliaLoadingEmits>()
defineSlots<InaliaLoadingSlots>()

const ui = computed(() => inaliaLoading())
</script>

<template>
  <div :class="ui.base({ class: [props.ui?.base, props.class] })">
    <p>Loading...</p>
  </div>
</template>
