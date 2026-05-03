/** Matches `frontend-integration.md` §7.3–7.7 */

export const TECHNICIAN_STATUSES = [
  'pending_approval',
  'pending_documents',
  'approved',
  'rejected',
] as const

export type TechnicianStatus = (typeof TECHNICIAN_STATUSES)[number]

export interface TechnicianCustomServiceRequest {
  id: number
  requested_name: string
  status: string
  approved_service_id?: number | null
  approved_service_name?: string
  admin_note?: string
  created_at?: string
  reviewed_at?: string
}

export interface Technician {
  id: number
  name: string
  phone: string
  status: TechnicianStatus
  availability_status?: string
  avg_rating?: number
  total_ratings?: number
  acceptance_rate?: number
  completion_rate?: number
  profile_photo_url?: string | null
  id_card_photo_url?: string | null
  service_radius_km?: number
  work_start_time?: string
  work_end_time?: string
  work_days?: unknown[]
  services?: string[]
  pending_custom_service_requests_count?: number
  custom_service_requests?: TechnicianCustomServiceRequest[]
  created_at: string
}

export interface TechniciansListResponse {
  results: Technician[]
  total: number
  page: number
}

export interface GetTechniciansParams {
  page: number
  limit: number
  status?: TechnicianStatus | ''
}

export function technicianNeedsModeration(status: TechnicianStatus): boolean {
  return status === 'pending_approval' || status === 'pending_documents'
}
