import type { AdminDashboardResponse } from '../types/admin.api'

export interface DashboardInsightBlock {
  title: string
  body: string
}

export type DashboardActivityKind = 'request' | 'technician' | 'customer' | 'rating' | 'system'

export interface DashboardActivityItem {
  id: string
  title: string
  subtitle?: string
  meta?: string
  kind: DashboardActivityKind
}

export interface DashboardActivityContent {
  insight: DashboardInsightBlock | null
  /** @deprecated Prefer `activityItems`; kept for debugging */
  activityLines: string[]
  activityItems: DashboardActivityItem[]
}

function activitySourceRows(data: AdminDashboardResponse): unknown[] {
  const a = data.recent_activity
  const r = data.recent_requests
  if (Array.isArray(a) && a.length > 0) return a
  if (Array.isArray(r) && r.length > 0) return r
  if (Array.isArray(a)) return a
  if (Array.isArray(r)) return r
  return []
}

function pickStr(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = obj[k]
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return undefined
}

function formatActivityMeta(v: unknown): string | undefined {
  if (v == null) return undefined
  if (typeof v === 'string') {
    const parsed = Date.parse(v)
    if (!Number.isNaN(parsed)) {
      return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(
        new Date(parsed),
      )
    }
    return v
  }
  if (typeof v === 'number') {
    const ms = v < 1e12 ? v * 1000 : v
    const d = new Date(ms)
    if (!Number.isNaN(d.getTime())) {
      return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(d)
    }
  }
  return undefined
}

function inferActivityKind(o: Record<string, unknown>): DashboardActivityKind {
  const t = String(o.type ?? o.entity ?? o.category ?? o.event ?? '').toLowerCase()
  if (t.includes('request') || o.request_id != null) return 'request'
  if (t.includes('tech') || o.technician_id != null) return 'technician'
  if (t.includes('rating') || o.rating != null || o.stars != null) return 'rating'
  if (t.includes('customer') || o.customer_id != null) return 'customer'
  return 'system'
}

function fallbackTitle(o: Record<string, unknown>): string {
  const bits: string[] = []
  if (o.type != null && String(o.type).trim()) bits.push(String(o.type))
  if (o.request_id != null) bits.push(`Request #${o.request_id}`)
  else if (o.id != null) bits.push(`#${o.id}`)
  return bits.length ? bits.join(' · ') : 'Activity update'
}

function normalizeObjectActivity(o: Record<string, unknown>, index: number): DashboardActivityItem {
  const kind = inferActivityKind(o)
  const title =
    pickStr(o, ['message', 'title', 'description', 'summary', 'action', 'label']) ?? fallbackTitle(o)

  const status = o.status != null ? String(o.status) : undefined
  const person =
    pickStr(o, ['technician_name', 'customer_name', 'user_name', 'name', 'actor', 'by']) ?? undefined
  const subtitleParts = [status, person].filter(
    (p): p is string => Boolean(p) && !title.toLowerCase().includes(String(p).toLowerCase()),
  )
  const subtitle = subtitleParts.length ? [...new Set(subtitleParts)].join(' · ') : undefined

  const meta =
    formatActivityMeta(o.created_at) ??
    formatActivityMeta(o.updated_at) ??
    formatActivityMeta(o.timestamp) ??
    formatActivityMeta(o.time) ??
    formatActivityMeta(o.date) ??
    undefined

  return {
    id: `activity-${index}-${title.slice(0, 48)}`,
    title,
    subtitle,
    meta,
    kind,
  }
}

/** Ensures React never tries to render raw objects (avoids white-screen crash). */
function toActivityLine(item: unknown): string {
  if (typeof item === 'string') return item
  if (item !== null && typeof item === 'object') {
    try {
      return JSON.stringify(item)
    } catch {
      return '[activity item]'
    }
  }
  return String(item ?? '')
}

function normalizeActivityItem(item: unknown, index: number): DashboardActivityItem {
  if (typeof item === 'string') {
    const trimmed = item.trim()
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed: unknown = JSON.parse(trimmed)
        if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return normalizeObjectActivity(parsed as Record<string, unknown>, index)
        }
      } catch {
        /* plain string */
      }
    }
    return {
      id: `activity-${index}-${trimmed.slice(0, 48)}`,
      title: trimmed || 'Activity',
      kind: 'system',
    }
  }
  if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
    return normalizeObjectActivity(item as Record<string, unknown>, index)
  }
  const line = toActivityLine(item)
  return {
    id: `activity-${index}-${line.slice(0, 48)}`,
    title: line,
    kind: 'system',
  }
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

  const rows = activitySourceRows(data)
  const activityItems = rows.map(normalizeActivityItem)
  const activityLines = rows.map(toActivityLine)

  return {
    insight,
    activityLines,
    activityItems,
  }
}
