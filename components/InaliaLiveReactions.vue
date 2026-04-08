<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed, onUnmounted, ref, watch } from 'vue'
import { useInaliaLiveReactions } from '../composables/useInaliaLiveReactions'

const inaliaLiveReactions = tv({
  slots: {
    base: '',
    reaction: 'absolute z-100 inalia-live-reaction text-3xl pointer-event-none select-none',
  },
})

export interface InaliaLiveReactionsProps {
  class?: any
  disabled?: boolean
  ui?: Partial<typeof inaliaLiveReactions.slots>
}
export interface InaliaLiveReactionsEmits {}
export interface InaliaLiveReactionsSlots {}
</script>

<script lang="ts" setup>
const props = withDefaults(defineProps<InaliaLiveReactionsProps>(), {
  disabled: false,
})
defineEmits<InaliaLiveReactionsEmits>()
defineSlots<InaliaLiveReactionsSlots>()

const ui = computed(() => inaliaLiveReactions())

const { liveReactions, listen, dispose } = useInaliaLiveReactions()

const isListening = ref(false)

watch(() => props.disabled, (disabled) => {
  if (disabled) {
    if (isListening.value) {
      dispose()
      isListening.value = false
    }

    return
  }

  if (!isListening.value) {
    listen()
    isListening.value = true
  }
}, { immediate: true })

onUnmounted(() => {
  if (isListening.value) {
    dispose()
    isListening.value = false
  }
})
</script>

<template>
  <TransitionGroup
    v-if="!props.disabled"
    tag="div"
    name="inalia-fade"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <div
      v-for="liveReaction in liveReactions"
      :key="liveReaction.id"
      :class="ui.reaction({ class: props.ui?.reaction })"
      :style="`left: ${liveReaction.position.x}%; bottom: ${liveReaction.position.y}%; transform: scale(${liveReaction.scale});`"
    >
      {{ liveReaction.emoji }}
    </div>
  </TransitionGroup>
</template>
