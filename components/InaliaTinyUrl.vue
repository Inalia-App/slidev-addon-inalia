<script lang="ts" setup>
defineProps({
  url: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <a :href="url" target="_blank">
    {{ url }}
  </a>
</template>
