const lineBreak = /\r?\n/
const inaliaAssignment = /^\s*(?:export\s+)?(VITE_INALIA_API_KEY|VITE_INALIA_USERNAME|VITE_INALIA_TALK_NUMBER|VITE_INALIA_AUTH|VITE_INALIA_ENDPOINT)\s*=/

export function mergeInaliaEnv(content: string, values: Record<string, string>): string {
  const eol = content.includes('\r\n') ? '\r\n' : '\n'
  const remaining = new Map(Object.entries(values))
  const lines = content ? content.split(lineBreak) : []
  const updated = lines.map((line) => {
    const match = line.match(inaliaAssignment)
    if (!match || !Object.hasOwn(values, match[1]))
      return line
    const key = match[1]
    if (!(key in values))
      return line
    remaining.delete(key)
    return `${key}=${quote(values[key])}`
  })
  if (updated.at(-1) === '')
    updated.pop()
  for (const [key, value] of remaining)
    updated.push(`${key}=${quote(value)}`)
  return updated.join(eol) + eol
}

function quote(value: string): string {
  // Vite expands dollar signs even in quoted dotenv values.
  return JSON.stringify(value.trim()).replace(/\$/g, '\\$')
}
