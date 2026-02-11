<script lang="ts" setup>
const props = defineProps<{
  message: string
}>()
defineSlots<{
  actions: (props: any) => any
}>()
</script>

<template>
  <div class="flex flex-row items-center bg-red-500 text-white p-4 justify-between">
    <p>
      {{ props.message }}
    </p>

    <div class="flex">
      <slot name="actions" />
    </div>
  </div>
</template>
