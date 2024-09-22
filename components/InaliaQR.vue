<script lang="ts" setup>
import { useQRCode } from '../composables/useInaliaQRCode'

const props = defineProps<{
  url: string
}>()

const { qr } = useQRCode(() => props.url)
</script>

<template>
  <a :href="props.url" target="_blank">
    <span v-html="qr" />
  </a>
</template>
