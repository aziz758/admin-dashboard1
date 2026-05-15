import { isAxiosError } from 'axios'

/**
 * Normalizes FastAPI `detail` (string | list[ValidationError] | list[str] | object) and similar shapes.
 * @see `docs/frontend-integration.md` §1 Common Errors
 */
function formatDetailValue(detail: unknown): string | null {
  if (typeof detail === 'string') {
    const t = detail.trim()
    return t.length > 0 ? t : null
  }

  if (Array.isArray(detail)) {
    const parts: string[] = []
    for (const item of detail) {
      if (typeof item === 'string') {
        const t = item.trim()
        if (t) parts.push(t)
        continue
      }
      if (typeof item === 'object' && item !== null) {
        const o = item as Record<string, unknown>
        if (typeof o.msg === 'string' && o.msg.trim()) {
          const locRaw = o.loc
          let loc = ''
          if (Array.isArray(locRaw)) {
            loc = locRaw
              .map((x) => (typeof x === 'string' || typeof x === 'number' ? String(x) : ''))
              .filter(Boolean)
              .join('.')
          }
          parts.push(loc ? `${loc}: ${o.msg.trim()}` : o.msg.trim())
        }
      }
    }
    if (parts.length) return parts.join(' · ')
  }

  if (typeof detail === 'object' && detail !== null && !Array.isArray(detail)) {
    const o = detail as Record<string, unknown>
    if (typeof o.msg === 'string' && o.msg.trim()) return o.msg.trim()
  }

  return null
}

function detailFromResponseData(data: unknown): string | null {
  if (typeof data === 'string') {
    const t = data.trim()
    if (t.startsWith('{')) {
      try {
        return detailFromResponseData(JSON.parse(t) as unknown)
      } catch {
        return t.length > 200 ? `${t.slice(0, 200)}…` : t || null
      }
    }
    return t.length > 0 ? t : null
  }

  if (typeof data !== 'object' || data === null) return null
  const obj = data as Record<string, unknown>

  if ('detail' in obj) {
    const fromDetail = formatDetailValue(obj.detail)
    if (fromDetail) return fromDetail
  }

  if (typeof obj.message === 'string' && obj.message.trim()) {
    return obj.message.trim()
  }

  return null
}

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const status = error.response?.status
    const data = error.response?.data
    const fromDetail = detailFromResponseData(data)
    if (fromDetail) return fromDetail

    if (status === 401) {
      return 'Unauthorized. Check your phone and password.'
    }
    if (status === 403) {
      return 'Access denied. Your account may be inactive or lack permission.'
    }
    if (status === 404) {
      return 'Not found.'
    }
    if (status === 409) {
      return 'Conflict: this action is not allowed in the current state.'
    }
    if (status === 413) {
      return 'Payload too large (e.g. image over 5 MB).'
    }
    if (status === 422) {
      return 'Validation failed. Check your input.'
    }

    return error.message || 'Request failed'
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong'
}
