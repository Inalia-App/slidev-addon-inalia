export function mergeInaliaEnv(content, values) {
  const eol = content.includes('\r\n') ? '\r\n' : '\n'
  const remaining = new Map(Object.entries(values))
  const lines = content ? content.split(/\r?\n/) : []
  const updated = lines.map((line) => {
    const match = line.match(/^\s*(?:export\s+)?(VITE_INALIA_API_KEY|VITE_INALIA_TALK_NUMBER)\s*=/)
    if (!match || !Object.hasOwn(values, match[1]))
      return line
    const key = match[1]
    remaining.delete(key)
    return `${key}=${quote(values[key])}`
  })
  if (updated.at(-1) === '')
    updated.pop()
  for (const [key, value] of remaining)
    updated.push(`${key}=${quote(value)}`)
  return updated.join(eol) + eol
}

function quote(value) {
  // Vite expands dollar signs even in quoted dotenv values.
  return JSON.stringify(value.trim()).replace(/\$/g, '\\$')
}
