/** `docs/frontend-integration.md` §4.5 */

export interface LoginRequest {
  phone: string
  password: string
  user_type: 'customer'
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user_id: number
  user_type: string
}
