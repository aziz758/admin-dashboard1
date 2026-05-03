import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../../utils/authStorage'

/**
 * Route guard that redirects unauthenticated users to the login page.
 *
 * Wrap protected `<Route>` trees with this component:
 * ```
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/dashboard" element={<DashboardPage />} />
 * </Route>
 * ```
 *
 * The original `location` is forwarded via router state so the login page
 * can redirect back after a successful login.
 */
export function ProtectedRoute() {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
