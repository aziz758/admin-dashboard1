/**
 * Auth token management.
 *
 * Current strategy: localStorage (works without backend changes).
 * Future strategy: httpOnly cookies — when the backend sets a Secure/HttpOnly
 * cookie, switch `AUTH_STRATEGY` to 'cookie'. All consumer code stays the same
 * because it imports these thin helpers rather than touching storage directly.
 */

const AUTH_STRATEGY: 'localStorage' | 'cookie' = 'localStorage'
const ACCESS_TOKEN_KEY = 'access_token'
const LOGIN_PATH = '/login'
const SESSION_USER_ID_KEY = 'admin_session_user_id'
const SESSION_USER_TYPE_KEY = 'admin_session_user_type'

/* ------------------------------------------------------------------ */
/*  Read / write / clear                                               */
/* ------------------------------------------------------------------ */

/**
 * Returns the access token if available.
 * When using cookie strategy, the token is managed by the browser and this
 * returns `null` (Axios sends the cookie automatically via `withCredentials`).
 */
export function getAccessToken(): string | null {
  if (AUTH_STRATEGY === 'cookie') return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

/**
 * Persist a token received from the login response.
 * No-op when the cookie strategy is active.
 */
export function setAccessToken(token: string): void {
  if (AUTH_STRATEGY === 'cookie') return
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

/** Non-sensitive post-login metadata (tab-scoped). */
export function setSessionIdentity(userId: number, userType: string): void {
  try {
    sessionStorage.setItem(SESSION_USER_ID_KEY, String(userId))
    sessionStorage.setItem(SESSION_USER_TYPE_KEY, userType)
  } catch {
    // private mode / quota — ignore
  }
}

function clearSessionIdentity(): void {
  try {
    sessionStorage.removeItem(SESSION_USER_ID_KEY)
    sessionStorage.removeItem(SESSION_USER_TYPE_KEY)
  } catch {
    // ignore
  }
}

/** Remove all auth artifacts from the client. */
export function clearSession(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  clearSessionIdentity()
  // When cookie strategy is active the backend is responsible for clearing
  // the cookie (e.g. via a /logout endpoint). We still remove any residual
  // localStorage key just in case.
}

/* ------------------------------------------------------------------ */
/*  Auth state helpers                                                 */
/* ------------------------------------------------------------------ */

/** Quick synchronous check — true if we *think* the user is logged in. */
export function isAuthenticated(): boolean {
  if (AUTH_STRATEGY === 'cookie') {
    // With httpOnly cookies we can't inspect the token on the client.
    // Rely on a lightweight /me or /verify endpoint in the real implementation.
    // For now fall back to a flag stored during login.
    return localStorage.getItem('is_logged_in') === '1'
  }
  return getAccessToken() !== null
}

/**
 * Mark the session as active (called after a successful login).
 * With cookie strategy we set a non-sensitive flag so `isAuthenticated`
 * can do a quick check without hitting the network.
 */
export function markSessionActive(): void {
  if (AUTH_STRATEGY === 'cookie') {
    localStorage.setItem('is_logged_in', '1')
  }
}

/**
 * Called by the Axios interceptor on every 401 (including failed login).
 * - Clears stored credentials so a bad or expired token is not reused.
 * - Full-page redirect to `/login` when the user is inside the app shell; no redirect when the path
 *   is already `/login` so the login form can show `getErrorMessage` without a reload loop.
 */
export function handleUnauthorized(): void {
  clearSession()
  if (AUTH_STRATEGY === 'cookie') {
    localStorage.removeItem('is_logged_in')
  }
  if (window.location.pathname !== LOGIN_PATH) {
    window.location.replace(LOGIN_PATH)
  }
}
