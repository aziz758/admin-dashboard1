import axios, { isAxiosError } from 'axios'
import { getAccessToken, handleUnauthorized } from '../utils/authStorage'

/** Axios `baseURL` — must end with `/api` (see `docs/frontend-integration.md` §1). */
function resolveApiBaseURL(): string {
  const raw = import.meta.env.VITE_API_URL?.trim()
  if (!raw) return 'http://192.168.43.198:8000/api'
  const base = raw.replace(/\/+$/, '')
  if (base.endsWith('/api')) return base
  return `${base}/api`
}

export const api = axios.create({
  baseURL: resolveApiBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`)
    }
    return config
  },
  (error) => Promise.reject(error),
)

/**
 * 401 handling (after phone + `user_type: customer` login — see `LoginPage.tsx`):
 * - Clears token / session metadata and redirects to `/login`, except when already on the login route
 *   (avoids reload loop; wrong-password responses still clear any stale token).
 * - UI toasts use `getErrorMessage` which prefers FastAPI `detail` when present.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      handleUnauthorized()
    }
    return Promise.reject(error)
  },
)
