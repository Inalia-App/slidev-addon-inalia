<script lang="ts">
import { DialogContent, DialogOverlay, DialogRoot, DialogTitle } from 'reka-ui'
import { tv } from 'tailwind-variants'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useInaliaAudienceQuestionHighlighted } from '../composables/useInaliaAudienceQuestionHighlighted'

const inaliaAudienceQuestionHighlighted = tv({
  slots: {
    base: '',
    overlay: 'fixed inset-0 z-10 bg-white/60 backdrop-blur-sm data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]',
    content: 'fixed z-10 data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in] left-1/2 -translate-x-1/2 rounded-lg w-full top-1/2 -translate-y-1/2 bg-white shadow-lg max-w-3xl border border-gray-200 py-4 px-8 focus:outline-none',
    title: 'text-xl leading-[1.2]',
    author: 'text-lg text-right text-gray-500 italic mt-2',
  },
})

export interface InaliaAudienceQuestionHighlightedProps {
  class?: any
  ui?: Partial<typeof inaliaAudienceQuestionHighlighted.slots>
}
export interface InaliaAudienceQuestionHighlightedEmits {}
export interface InaliaAudienceQuestionHighlightedSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<InaliaAudienceQuestionHighlightedProps>()
defineEmits<InaliaAudienceQuestionHighlightedEmits>()
defineSlots<InaliaAudienceQuestionHighlightedSlots>()

const ui = computed(() => inaliaAudienceQuestionHighlighted())

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
  <DialogRoot v-model:open="isOpen" :class="ui.base({ class: [props.ui?.base, props.class] })">
    <DialogOverlay :class="ui.overlay({ class: props.ui?.overlay })" />
    <DialogContent :class="ui.content({ class: props.ui?.content })" :aria-describedby="undefined">
      <DialogTitle :class="ui.title({ class: props.ui?.title })">
        {{ audienceQuestion?.question }}
      </DialogTitle>

      <div :class="ui.author({ class: props.ui?.author })">
        Anonymous
      </div>
    </DialogContent>
  </DialogRoot>
</template>
