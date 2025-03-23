<script lang="ts" setup>
import type { AugmentedLiveReaction } from '../types/live-reaction'
import InaliaLiveReaction from './InaliaLiveReaction.vue'

const props = defineProps<{
  liveReactions: AugmentedLiveReaction[]
}>()
</script>

<template>
  <TransitionGroup tag="div" name="inalia-fade">
    <InaliaLiveReaction
      v-for="liveReaction in props.liveReactions"
      :key="liveReaction.id"
      :live-reaction="liveReaction"
    />
  </TransitionGroup>
</template>
