<script lang="ts" setup>
const emit = defineEmits<{
  run: [void]
}>()

function onRun() {
  emit('run')
}
</script>

<template>
  <div class="flex flex-row items-center bg-red-500 text-white p-4 justify-between">
    <p>
      Run your talk to activate all functionalities.
    </p>

    <button @click="onRun">
      Run Talk
    </button>
  </div>
</template>
