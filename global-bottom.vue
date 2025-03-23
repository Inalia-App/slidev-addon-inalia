<script lang="ts" setup>
import InaliaLiveReactions from './components/InaliaLiveReactions.vue'
import { useInaliaLiveReactions } from './composables/useInaliaLiveReactions'

const { liveReactions } = useInaliaLiveReactions()

function onLiveReactionDisappear(id: string) {
  const index = liveReactions.value.findIndex(reaction => reaction.id === id)

  if (index !== -1) {
    liveReactions.value.splice(index, 1)
  }
}
</script>

<template>
  <InaliaLiveReactions class="relative w-full h-full" :live-reactions="liveReactions" @disappear="onLiveReactionDisappear" />
</template>
