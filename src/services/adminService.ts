import type {
  ApproveCustomServiceBody,
  CustomServiceRequestReviewed,
} from '../types/customServiceRequests.api'
import type { AdminDashboardResponse, AdminStatisticsResponse } from '../types/admin.api'
import type { ServiceCatalogItem } from '../types/services.api'
import type {
  AdminRatingRow,
  AdminRatingsListResponse,
  GetRatingsParams,
} from '../types/ratings.api'
import type {
  AdminDirectoryUserType,
  AdminUserRow,
  AdminUsersListResponse,
  GetUsersParams,
} from '../types/users.api'
import type { BroadcastNotificationRequest } from '../types/notifications.api'
import type {
  AdminRequest,
  GetRequestsParams,
  RequestsListResponse,
} from '../types/requests.api'
import { isAxiosError } from 'axios'
import type {
  GetTechniciansParams,
  Technician,
  TechniciansListResponse,
} from '../types/technicians.api'
import { api } from './api'

export async function getServicesCatalog(): Promise<ServiceCatalogItem[]> {
  const { data } = await api.get<unknown>('/services/')
  if (!Array.isArray(data)) return []
  return data as ServiceCatalogItem[]
}

export async function approveCustomServiceRequest(
  serviceRequestId: number,
  body: ApproveCustomServiceBody,
): Promise<CustomServiceRequestReviewed> {
  const { data } = await api.put<CustomServiceRequestReviewed>(
    `/admin/custom-service-requests/${serviceRequestId}/approve`,
    body,
  )
  return data
}

export async function rejectCustomServiceRequest(
  serviceRequestId: number,
  body: { admin_note: string },
): Promise<CustomServiceRequestReviewed> {
  const { data } = await api.put<CustomServiceRequestReviewed>(
    `/admin/custom-service-requests/${serviceRequestId}/reject`,
    body,
  )
  return data
}

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

export async function getTechnicianById(id: Technician['id']): Promise<Technician> {
  const { data } = await api.get<Technician>(`/admin/technicians/${id}`)
  return data
}

async function messageFromErrorBlob(blob: Blob): Promise<string> {
  if (!blob.type.includes('application/json')) {
    return 'Could not load ID document'
  }
  try {
    const text = await blob.text()
    const j = JSON.parse(text) as { detail?: unknown }
    if (typeof j.detail === 'string') return j.detail
    return 'Could not load ID document'
  } catch {
    return 'Could not load ID document'
  }
}

/** Protected image — use Blob + object URL in the UI. @see `docs/frontend-integration.md` §7.5 */
export async function getTechnicianIdCardBlob(id: Technician['id']): Promise<Blob> {
  try {
    const { data } = await api.get<Blob>(`/admin/technicians/${id}/documents/id-card`, {
      responseType: 'blob',
    })
    if (data.type?.includes('application/json')) {
      throw new Error(await messageFromErrorBlob(data))
    }
    return data
  } catch (e) {
    if (isAxiosError(e) && e.response?.data instanceof Blob) {
      throw new Error(await messageFromErrorBlob(e.response.data), { cause: e })
    }
    if (e instanceof Error) throw e
    throw new Error('Could not load ID document', { cause: e })
  }
}

export async function approveTechnician(id: Technician['id']): Promise<void> {
  await api.put(`/admin/technicians/${id}/status`, { status: 'approved' })
}

/**
 * Optional `admin_note` when rejecting (if backend rejects unknown fields, send `{ status }` only).
 */
export async function rejectTechnician(
  id: Technician['id'],
  body?: { reason?: string | null },
): Promise<void> {
  const note = body?.reason?.trim()
  await api.put(`/admin/technicians/${id}/status`, {
    status: 'rejected',
    ...(note ? { admin_note: note } : {}),
  })
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

function normalizeRatingsList(payload: unknown): AdminRatingsListResponse {
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
    results: results as AdminRatingRow[],
    total: Number.isFinite(total) ? total : 0,
    page: Number.isFinite(page) ? page : 1,
  }
}

export async function getRatings(params: GetRatingsParams): Promise<AdminRatingsListResponse> {
  const { page, limit } = params
  const { data } = await api.get<unknown>('/admin/ratings', {
    params: { page, limit },
  })
  return normalizeRatingsList(data)
}

function normalizeUsersList(payload: unknown): AdminUsersListResponse {
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
    results: results as AdminUserRow[],
    total: Number.isFinite(total) ? total : 0,
    page: Number.isFinite(page) ? page : 1,
  }
}

export async function getUsers(params: GetUsersParams): Promise<AdminUsersListResponse> {
  const { page, limit, user_type, search } = params
  const { data } = await api.get<unknown>('/admin/users', {
    params: {
      page,
      limit,
      ...(user_type ? { user_type } : {}),
      ...(search ? { search } : {}),
    },
  })
  return normalizeUsersList(data)
}

/** Soft delete — `?user_type=customer|technician` per integration guide §7.11 */
export async function deleteAdminUser(
  userId: number,
  userType: AdminDirectoryUserType,
): Promise<void> {
  await api.delete(`/admin/users/${userId}`, {
    params: { user_type: userType },
  })
}

export async function broadcastAdminNotification(
  body: BroadcastNotificationRequest,
): Promise<unknown> {
  const { data } = await api.post<unknown>('/admin/notifications/broadcast', body)
  return data
}
