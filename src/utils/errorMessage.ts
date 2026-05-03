import { isAxiosError } from 'axios'

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as unknown
    if (typeof data === 'object' && data !== null && 'detail' in data) {
      const detail = (data as { detail: unknown }).detail
      if (typeof detail === 'string') return detail
      if (Array.isArray(detail) && detail.length > 0 && typeof detail[0]?.msg === 'string') {
        return detail[0].msg
      }
    }
    if (error.response?.status === 401) {
      return 'Session expired. Signing you out…'
    }
    return error.message || 'Request failed'
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong'
}
