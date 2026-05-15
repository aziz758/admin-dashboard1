/** Admin ratings list — `docs/frontend-integration.md` §7.9 */

export interface AdminRatingRow {
  request_id: number
  rating: number
  comment: string
  customer_name: string
  customer_phone: string
  technician_name: string
  technician_phone: string
  created_at: string
}

export interface AdminRatingsListResponse {
  results: AdminRatingRow[]
  total: number
  page?: number
}

export interface GetRatingsParams {
  page: number
  limit: number
}
