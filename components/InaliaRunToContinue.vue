<script lang="ts">
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const inaliaRunToContinue = tv({
  slots: {
    base: 'flex flex-row items-center bg-red-500 text-white p-4 justify-between',
    button: '',
  },
})

export interface InaliaRunToContinueProps {
  class?: any
  ui?: Partial<typeof inaliaRunToContinue.slots>
}
export interface InaliaRunToContinueEmits {
  run: [void]
}
export interface InaliaRunToContinueSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<InaliaRunToContinueProps>()
const emit = defineEmits<InaliaRunToContinueEmits>()
defineSlots<InaliaRunToContinueSlots>()

const ui = computed(() => inaliaRunToContinue())

function onRun() {
  emit('run')
}
</script>

<template>
  <div :class="ui.base({ class: [props.ui?.base, props.class] })">
    <p>
      Run your talk to activate all functionalities.
    </p>

    <button :class="ui.button({ class: props.ui?.button })" @click="onRun">
      Run Talk
    </button>
  </div>
</template>
