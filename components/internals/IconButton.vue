<script setup lang="ts">
// @see https://github.com/slidevjs/slidev/blob/main/packages/client/internals/IconButton.vue
import { computed } from 'vue'

const props = defineProps<{
  title: string
  icon?: string
  as?: string
  to?: string
}>()

const type = computed(() => props.as || (props.to ? 'router-link' : 'button'))
</script>

<template>
  <component :is="type" class="slidev-icon-btn" :title="title" :to="to">
    <span class="sr-only">{{ title }}</span>
    <slot>
      <div :class="icon" />
    </slot>
  </component>
</template>
