<script lang="ts" setup>
const emit = defineEmits<{
  run: [void]
  demo: [void]
}>()

function onRun() {
  emit('run')
}

function onDemo() {
  emit('demo')
}
</script>

<template>
  <div class="flex flex-row items-center bg-red-500 text-white p-4 justify-between">
    <p>
      Run your talk to activate all functionalities.
    </p>

    <div class="flex gap-2">
      <button @click="onDemo">
        Demo Mode
      </button>

      <button @click="onRun">
        Run Talk
      </button>
    </div>
  </div>
</template>
