import { isAxiosError } from 'axios'

function detailFromResponseData(data: unknown): string | null {
  if (typeof data !== 'object' || data === null || !('detail' in data)) return null
  const detail = (data as { detail: unknown }).detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail.length > 0) {
    const msgs = detail
      .map((item) => {
        if (typeof item === 'object' && item !== null && 'msg' in item) {
          const m = (item as { msg: unknown }).msg
          return typeof m === 'string' ? m : ''
        }
        return ''
      })
      .filter(Boolean)
    if (msgs.length) return msgs.join(' · ')
  }
  return null
}

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const status = error.response?.status
    const fromDetail = detailFromResponseData(error.response?.data)
    if (fromDetail) return fromDetail

    if (status === 401) {
      return 'Unauthorized. Check your phone and password.'
    }
    if (status === 403) {
      return 'Access denied. Your account may be inactive or lack permission.'
    }
    return error.message || 'Request failed'
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong'
}
