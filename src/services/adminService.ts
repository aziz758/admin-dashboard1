import type { AdminDashboardResponse, AdminStatisticsResponse } from '../types/admin.api'
import type {
  AdminRequest,
  GetRequestsParams,
  RequestsListResponse,
} from '../types/requests.api'
import type {
  GetTechniciansParams,
  Technician,
  TechniciansListResponse,
} from '../types/technicians.api'
import { api } from './api'

export async function getStatistics(): Promise<AdminStatisticsResponse> {
  const { data } = await api.get<AdminStatisticsResponse>('/admin/statistics')
  return data
}

export async function getDashboard(): Promise<AdminDashboardResponse> {
  const { data } = await api.get<AdminDashboardResponse>('/admin/dashboard')
  return data
}

function normalizeTechniciansList(payload: unknown): TechniciansListResponse {
  if (!payload || typeof payload !== 'object') {
    return { results: [], total: 0, page: 1 }
  }
  const raw = payload as Record<string, unknown>
  let results: unknown[] = []
  if (Array.isArray(raw.results)) results = raw.results
  else if (Array.isArray(raw.items)) results = raw.items
  const total = typeof raw.total === 'number' ? raw.total : Number(raw.total ?? 0)
  const page = typeof raw.page === 'number' ? raw.page : Number(raw.page ?? 1)
  return {
    results: results as Technician[],
    total: Number.isFinite(total) ? total : 0,
    page: Number.isFinite(page) ? page : 1,
  }
}

export async function getTechnicians(params: GetTechniciansParams): Promise<TechniciansListResponse> {
  const { page, limit, status } = params
  const { data } = await api.get<unknown>('/admin/technicians', {
    params: {
      page,
      limit,
      ...(status ? { status } : {}),
    },
  })
  return normalizeTechniciansList(data)
}

export async function approveTechnician(id: Technician['id']): Promise<void> {
  await api.put(`/admin/technicians/${id}/status`, { status: 'approved' })
}

export async function rejectTechnician(
  id: Technician['id'],
  _body?: { reason?: string | null },
): Promise<void> {
  await api.put(`/admin/technicians/${id}/status`, { status: 'rejected' })
}

function normalizeRequestsList(payload: unknown): RequestsListResponse {
  if (!payload || typeof payload !== 'object') {
    return { results: [], total: 0, page: 1 }
  }
  const raw = payload as Record<string, unknown>
  let results: unknown[] = []
  if (Array.isArray(raw.results)) results = raw.results
  else if (Array.isArray(raw.items)) results = raw.items
  const total = typeof raw.total === 'number' ? raw.total : Number(raw.total ?? 0)
  const page = typeof raw.page === 'number' ? raw.page : Number(raw.page ?? 1)
  return {
    results: results as AdminRequest[],
    total: Number.isFinite(total) ? total : 0,
    page: Number.isFinite(page) ? page : 1,
  }
}

export async function getRequests(params: GetRequestsParams): Promise<RequestsListResponse> {
  const { page, limit, status } = params
  const { data } = await api.get<unknown>('/admin/requests', {
    params: {
      page,
      limit,
      ...(status ? { status } : {}),
    },
  })
  return normalizeRequestsList(data)
}
