/** `docs/frontend-integration.md` §7.6 */

export type ApproveCustomServiceBody =
  | { service_id: number; admin_note?: string }
  | { service_name: string; admin_note?: string }

export interface CustomServiceRequestReviewed {
  id: number
  requested_name: string
  status: string
  approved_service_id?: number | null
  approved_service_name?: string
  admin_note?: string
  created_at?: string
  reviewed_at?: string
}
