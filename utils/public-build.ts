/**
 * VITE_ values are public client configuration, not secrets.
 * Override both direct access and Vite's import.meta.env object during builds.
 */
export function publicBuildDefines(command: string, allowPublicToken: string | undefined): Record<string, string> {
  if (command !== 'build' || allowPublicToken === 'true')
    return {}

  return {
    'import.meta.env.VITE_INALIA_API_KEY': 'undefined',
  }
}
