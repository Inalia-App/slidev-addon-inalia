<script lang="ts" setup>
import Alert from './internals/Alert.vue'

const emit = defineEmits<{
  run: [void]
}>()

function onRun() {
  emit('run')
}
</script>

<template>
  <Alert
    message="Run your talk to activate all functionalities."
  >
    <template #actions>
      <button @click="onRun">
        Run Talk
      </button>
    </template>
  </Alert>
</template>
