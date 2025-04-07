<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { useInaliaLiveReactions } from '../composables/useInaliaLiveReactions'

const { liveReactions, listen, dispose } = useInaliaLiveReactions()

onMounted(() => {
  listen()
})
onUnmounted(() => {
  dispose()
})
</script>

<template>
  <TransitionGroup tag="div" name="inalia-fade">
    <div
      v-for="liveReaction in liveReactions"
      :key="liveReaction.id"
      class="absolute z-100 inalia-live-reaction text-3xl pointer-event-none select-none"
      :style="`left: ${liveReaction.position.x}%; bottom: ${liveReaction.position.y}%; transform: scale(${liveReaction.scale});`"
    >
      {{ liveReaction.emoji }}
    </div>
  </TransitionGroup>
</template>
