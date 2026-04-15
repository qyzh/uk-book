export function getShortId(id: string): string {
  if (!id) return ''
  return id.slice(-4)
}

export function getBookUrl(id: string): string {
  return `/books/${getShortId(id)}`
}
