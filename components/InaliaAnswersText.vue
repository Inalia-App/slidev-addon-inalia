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
    class="inalia inalia-answers-text space-x-8 whitespace-wrap"
  >
    <li v-for="answer in answers" :key="answer" class="inline">
      {{ answer }}
    </li>
  </ul>
</template>
