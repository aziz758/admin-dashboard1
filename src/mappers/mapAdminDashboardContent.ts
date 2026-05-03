import type { AdminDashboardResponse } from '../types/admin.api'

export interface DashboardInsightBlock {
  title: string
  body: string
}

export interface DashboardActivityContent {
  insight: DashboardInsightBlock | null
  activityLines: string[]
}

export function mapAdminDashboardContent(data: AdminDashboardResponse): DashboardActivityContent {
  const insight =
    data.sla_insight_title && data.sla_insight_body
      ? { title: data.sla_insight_title, body: data.sla_insight_body }
      : data.sla_compliance_percent != null
        ? {
            title: 'SLA snapshot',
            body: `${data.sla_compliance_percent}% of jobs met SLA targets in the selected window.`,
          }
        : null

  const activityLines = data.recent_activity ?? []

  return {
    insight,
    activityLines,
  }
}
