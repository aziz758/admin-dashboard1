/**
 * Admin statistics — canonical shape from `docs/frontend-integration.md` §7.2.
 * Legacy aliases kept for older mocks / adapters.
 */

export interface AdminStatisticsResponse {
  /** Integration doc §7.2 */
  total_customers?: number
  total_technicians?: number
  pending_approval_count?: number
  total_requests?: number
  completed_requests?: number
  cancelled_requests?: number
  pending_requests?: number
  assigned_requests?: number
  avg_rating_platform?: number
  /** Older frontend naming / extras */
  active_technicians?: number
  technicians_change_percent?: number | null
  open_requests?: number
  requests_new_today?: number | null
  registered_users?: number
  users_change_percent?: number | null
  average_rating?: number
}

/** §7.1 — backend may omit SLA insight fields; lists may be objects or strings. */
export interface AdminDashboardResponse {
  sla_insight_title?: string | null
  sla_insight_body?: string | null
  sla_compliance_percent?: number | null
  recent_activity?: unknown[] | null
  statistics?: Record<string, unknown>
  recent_requests?: unknown[] | null
  pending_technicians?: unknown[] | null
  recent_ratings?: unknown[] | null
}
