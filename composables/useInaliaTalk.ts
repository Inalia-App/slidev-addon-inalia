import type { DeepReadonly, Ref } from 'vue'
import type { Talk } from '../types'
import { createSharedComposable } from '@vueuse/core'
import { readonly, ref } from 'vue'
import { fetchTalk as _fetchTalk } from '../utils/talk'

interface UseInaliaTalk {
  talk: DeepReadonly<Ref<Talk | null>>
  fetchTalk: () => void
}

function _useInaliaTalk(): UseInaliaTalk {
  const talk = ref<Talk | null>(null)

  async function fetchTalk(): Promise<void> {
    talk.value = await _fetchTalk()
  }

  return {
    talk: readonly(talk),

    fetchTalk,
  }
}

export const useInaliaTalk = createSharedComposable(_useInaliaTalk)
