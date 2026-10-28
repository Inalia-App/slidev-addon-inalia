/// <reference types="vite/client" />

declare const __INALIA_OAUTH_SESSION__: string
declare const __INALIA_OAUTH_MODE__: boolean

interface ImportMetaEnv {
  readonly VITE_INALIA_API_KEY: string
  readonly VITE_INALIA_ENDPOINT: string
  readonly VITE_INALIA_TALK_NUMBER: number
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
