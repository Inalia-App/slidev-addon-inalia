<script lang="ts" setup>
import IconButton from './components/internals/IconButton.vue'
import VerticalDivider from './components/internals/VerticalDivider.vue'
import { useInaliaTalk } from './composables/useInaliaTalk'

const { talk } = useInaliaTalk()
</script>

<template>
  <template v-if="talk">
    <VerticalDivider />
    <IconButton title="Talk" as="a" :href="talk.urls.details" target="_blank">
      <img src="https://inalia.app/favicon.svg" alt="Inalia Logo" class="size-5 grayscale-100">
    </IconButton>
    <VerticalDivider />
    <IconButton title="Dashboard" as="a" :href="talk.urls.dashboard" target="_blank">
      <div class="i-carbon:dashboard" />
    </IconButton>
    <IconButton title="Overview" as="a" :href="talk.urls.overview" target="_blank">
      <div class="i-carbon:product" />
    </IconButton>
  </template>
</template>
