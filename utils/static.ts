export const isStaticEnabled
  = !import.meta.env.VITE_INALIA_USERNAME
    || !import.meta.env.VITE_INALIA_TALK_NUMBER
    || !import.meta.env.VITE_INALIA_API_KEY
