<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const inaliaShortUrl = tv({
  slots: {
    base: '',
  },
})

export interface InaliaShortUrlProps {
  url: string
  class?: any
  ui?: Partial<typeof inaliaShortUrl.slots>
}
export interface InaliaShortUrlEmits {}
export interface InaliaShortUrlSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<InaliaShortUrlProps>()
defineEmits<InaliaShortUrlEmits>()
defineSlots<InaliaShortUrlSlots>()

const ui = computed(() => inaliaShortUrl())

const httpRegex = /^https?:\/\//
const textUrl = computed(() => {
  return props.url.replace(httpRegex, '')
})
</script>

<template>
  <a :href="url" target="_blank" :class="ui.base({ class: [props.ui?.base, props.class] })">
    {{ textUrl }}
  </a>
</template>
