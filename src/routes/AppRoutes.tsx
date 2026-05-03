import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { MainLayout } from '../layouts/MainLayout'
import {
  DashboardPage,
  NotificationsPage,
  RatingsPage,
  RequestsPage,
  TechniciansPage,
  UsersPage,
} from '../pages'
import LoginPage from '../pages/LoginPage'
import { ROUTES } from './paths'

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes — require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={ROUTES.technicians} element={<TechniciansPage />} />
          <Route path={ROUTES.requests} element={<RequestsPage />} />
          <Route path={ROUTES.users} element={<UsersPage />} />
          <Route path={ROUTES.ratings} element={<RatingsPage />} />
          <Route path={ROUTES.notifications} element={<NotificationsPage />} />
        </Route>
      </Route>

      {/* Fallbacks */}
      <Route path="/" element={<Navigate to={ROUTES.dashboard} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
    </Routes>
  )
}
