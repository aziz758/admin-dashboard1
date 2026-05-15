/** Admin users directory — `docs/frontend-integration.md` §7.11 */

export type AdminDirectoryUserType = 'customer' | 'technician'

export interface AdminUserRow {
  id: number
  name: string
  phone: string
  user_type: AdminDirectoryUserType
  status: string
  created_at: string
}

export interface AdminUsersListResponse {
  results: AdminUserRow[]
  total: number
  page?: number
}

export interface GetUsersParams {
  page: number
  limit: number
  /** Omit when empty — list all types */
  user_type?: AdminDirectoryUserType
  /** Omit when empty */
  search?: string
}
