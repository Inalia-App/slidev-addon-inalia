<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Answer } from '../types/answer'

defineProps({
  answers: {
    required: true,
    type: Array as PropType<Answer<'text'>[]>,
  },
})
</script>

<template>
  <ul
    class="inalia space-x-8 whitespace-wrap"
  >
    <li v-for="answer in answers" :key="answer.value" class="inline">
      {{ answer.value }}
    </li>
  </ul>
</template>
