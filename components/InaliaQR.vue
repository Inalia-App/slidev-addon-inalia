<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'
import { useQRCode } from '../composables/useInaliaQRCode'

const inaliaQR = tv({
  slots: {
    base: '',
  },
})

export interface InaliaQRProps {
  url: string
  class?: any
  ui?: Partial<typeof inaliaQR.slots>
}
export interface InaliaQREmits {}
export interface InaliaQRSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<InaliaQRProps>()
defineEmits<InaliaQREmits>()
defineSlots<InaliaQRSlots>()

const ui = computed(() => inaliaQR())

const { qr } = useQRCode(() => props.url)
</script>

<template>
  <a :href="props.url" target="_blank" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <span v-html="qr" />
  </a>
</template>
