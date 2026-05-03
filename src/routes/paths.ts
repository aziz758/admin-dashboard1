export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  technicians: '/technicians',
  requests: '/requests',
  users: '/users',
  ratings: '/ratings',
  notifications: '/notifications',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
