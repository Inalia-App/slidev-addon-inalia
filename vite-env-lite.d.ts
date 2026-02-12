/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INALIA_LITE_URL?: string
  readonly VITE_INALIA_LITE_TALK_ID: string
  readonly VITE_INALIA_LITE_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
