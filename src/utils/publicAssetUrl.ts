/** Resolve `/uploads/...` paths against API origin (no `/api` prefix). */
export function publicAssetUrl(path: string | null | undefined): string | null {
  if (!path?.trim()) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const origin = import.meta.env.VITE_API_ORIGIN ?? 'http://localhost:8000'
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${origin}${normalized}`
}
