<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
})

const textUrl = computed(() => {
  return props.url.replace(/https?:\/\//, '')
})
</script>

<template>
  <a :href="url" target="_blank">
    {{ textUrl }}
  </a>
</template>
