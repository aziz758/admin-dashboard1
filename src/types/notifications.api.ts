/** Admin broadcast — `docs/frontend-integration.md` §7.10 */

export type BroadcastTarget = 'all' | 'customers' | 'technicians' | 'specific'

export interface BroadcastNotificationRequest {
  title: string
  body: string
  target: BroadcastTarget
  user_ids: number[]
}
