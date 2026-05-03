/** Admin requests list — `frontend-integration.md` §7.8 */

export const REQUEST_STATUSES = ['pending', 'assigned', 'accepted', 'completed', 'cancelled'] as const

export type RequestStatus = (typeof REQUEST_STATUSES)[number]

export interface AdminRequest {
  id: number
  status: RequestStatus
  note: string
  image_url?: string | null
  address?: string
  lat?: number | null
  lng?: number | null
  created_at: string
  customer_id?: number
  customer_name: string
  customer_phone?: string
  technician_id?: number | null
  technician_name?: string | null
  technician_phone?: string | null
  services?: string[]
  customer_rating?: number
  technician_report?: string
  latest_reject_reason?: string
  latest_rejected_at?: string
}

export interface RequestsListResponse {
  results: AdminRequest[]
  total: number
  page: number
}

export interface GetRequestsParams {
  page: number
  limit: number
  status?: RequestStatus | ''
}
