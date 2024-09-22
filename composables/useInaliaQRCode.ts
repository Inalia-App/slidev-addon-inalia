import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { renderSVG } from 'uqr'
import { computed, toValue } from 'vue'

interface UseQRCode {
  qr: ComputedRef<string>

}

export function useQRCode(data: MaybeRefOrGetter<string>): UseQRCode {
  const qr = computed(() => renderSVG(toValue(data)))

  return {
    qr,
  }
}
