import { isMap, isScalar, isSeq, parseDocument } from 'yaml'

const frontmatterPattern = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?=\r?\n|$)/

export function addInaliaAddon(content: string): string {
  const eol = content.includes('\r\n') ? '\r\n' : '\n'
  const match = content.match(frontmatterPattern)
  const doc = parseDocument(match ? match[1] : '')
  if (doc.errors.length)
    throw new Error(`Invalid slide frontmatter: ${doc.errors[0].message}`)
  if (doc.contents !== null && !isMap(doc.contents))
    throw new Error('Slide frontmatter must be a YAML mapping.')

  const addons = doc.get('addons', true)
  if (addons !== undefined && !isSeq(addons))
    throw new Error('Frontmatter addons must be a YAML sequence.')

  // Slidev accepts both the full package name and its shorthand.
  if (addons?.items.some(item => isScalar(item) && ['inalia', 'slidev-addon-inalia'].includes(item.value as string)))
    return content

  if (addons)
    addons.add('slidev-addon-inalia')
  else
    doc.set('addons', ['slidev-addon-inalia'])

  const yaml = doc.toString().replace(/\r?\n/g, eol)
  const frontmatter = `---${eol}${yaml}---`
  return match
    ? frontmatter + content.slice(match[0].length)
    : frontmatter + eol + eol + content
}
