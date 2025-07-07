<script lang="ts" setup>
import { DialogContent, DialogOverlay, DialogRoot, DialogTitle } from 'reka-ui'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useInaliaAudienceQuestionHighlighted } from '../composables/useInaliaAudienceQuestionHighlighted'

const isOpen = ref(false)

const { audienceQuestion, clearAudienceQuestion, listen, dispose } = useInaliaAudienceQuestionHighlighted({
  onUnhighlighted: () => {
    isOpen.value = false

    setTimeout(() => {
      clearAudienceQuestion()
    }, 200)
  },
})

onMounted(() => {
  listen()
})
onUnmounted(() => {
  dispose()
})

watch(audienceQuestion, (newQuestion) => {
  if (newQuestion) {
    isOpen.value = true
  }
})
// Close the dialog when clicking outside of it
watch(isOpen, () => {
  if (!isOpen.value) {
    setTimeout(() => {
      clearAudienceQuestion()
    }, 200)
  }
})
</script>

<template>
  <DialogRoot v-model:open="isOpen">
    <DialogOverlay class="fixed inset-0 z-10 bg-white/60 backdrop-blur-sm data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]" />
    <DialogContent class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white rounded-lg shadow-lg w-full max-w-3xl border border-gray-200 py-4 px-8 focus:outline-none data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]" :aria-describedby="undefined">
      <DialogTitle class="text-xl leading-[1.2]">
        {{ audienceQuestion?.question }}
      </DialogTitle>

      <div class="text-right text-gray-500 text-lg italic mt-2">
        Anonymous
      </div>
    </DialogContent>
  </DialogRoot>
</template>
