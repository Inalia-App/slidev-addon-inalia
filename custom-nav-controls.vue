<script lang="ts" setup>
import IconButton from './components/internals/IconButton.vue'
import VerticalDivider from './components/internals/VerticalDivider.vue'
import { useInaliaTalk } from './composables/useInaliaTalk'

const { talk } = useInaliaTalk()
</script>

<template>
  <template v-if="talk">
    <VerticalDivider />
    <IconButton title="Inalia" as="a" :href="talk.urls.overview" target="_blank">
      <img src="https://inalia.app/favicon.svg" alt="Inalia Logo" class="size-5 grayscale-100">
    </IconButton>
    <VerticalDivider />
    <IconButton title="Overview" as="a" :href="talk.urls.details" target="_blank">
      <div class="i-carbon:settings-edit" />
    </IconButton>
    <IconButton title="Dashboard" to="/inalia/dashboard">
      <div class="i-carbon:dashboard" />
    </IconButton>
  </template>
</template>
