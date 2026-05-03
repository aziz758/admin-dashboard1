/**
 * Shapes expected from the backend. Adjust field names to match your API
 * (e.g. snake_case from FastAPI/Django).
 */

export interface AdminStatisticsResponse {
  active_technicians: number
  technicians_change_percent?: number | null
  open_requests: number
  requests_new_today?: number | null
  registered_users: number
  users_change_percent?: number | null
  average_rating: number
}

export interface AdminDashboardResponse {
  sla_insight_title?: string | null
  sla_insight_body?: string | null
  sla_compliance_percent?: number | null
  recent_activity?: string[] | null
}
