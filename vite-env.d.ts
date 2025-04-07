/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INALIA_API_KEY: string
  readonly VITE_INALIA_ENDPOINT: string
  readonly VITE_INALIA_USERNAME: string
  readonly VITE_INALIA_TALK_NUMBER: number
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
