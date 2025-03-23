<script lang="ts" setup>
import type { AugmentedLiveReaction } from '../types/live-reaction'

const props = defineProps<{
  liveReaction: AugmentedLiveReaction
}>()
</script>

<template>
  <div
    class="inalia-live-reaction absolute text-3xl pointer-event-none select-none"
    :style="`left: ${props.liveReaction.position.x}%; bottom: ${props.liveReaction.position.y}%; transform: scale(${props.liveReaction.scale});`"
  >
    {{ props.liveReaction.emoji }}
  </div>
</template>
