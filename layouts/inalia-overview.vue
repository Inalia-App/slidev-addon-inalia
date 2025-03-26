<script lang="ts" setup>
import InaliaPoweredBy from '../components/InaliaPoweredBy.vue'
import InaliaQR from '../components/InaliaQR.vue'
import InaliaShortUrl from '../components/InaliaShortUrl.vue'
import { useInaliaTalk } from '../composables/useInaliaTalk'

const { talk } = useInaliaTalk()
</script>

<template>
  <div class="h-full grid slidev-layout inalia-overview">
    <template v-if="talk">
      <div class="flex flex-col space-y-2 justify-center items-center">
        <div
          class="inalia shrink-0 w-60 h-60 rounded-lg overflow-hidden"
        >
          <InaliaQR
            :url="talk.urls.tiny_overview" class="block"
          />
        </div>
        <InaliaShortUrl :url="talk.urls.tiny_overview" class="border-0! text-xs mx-auto" />
      </div>
    </template>

    <div class="absolute op-40 bottom-2 left-1/2 -translate-x-1/2">
      <InaliaPoweredBy />
    </div>
  </div>
</template>
