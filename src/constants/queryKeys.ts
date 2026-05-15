import type { GetRatingsParams } from '../types/ratings.api'
import type { GetUsersParams } from '../types/users.api'
import type { GetRequestsParams } from '../types/requests.api'
import type { GetTechniciansParams } from '../types/technicians.api'

export const queryKeys = {
  services: {
    all: ['services'] as const,
    catalog: ['services', 'catalog'] as const,
  },
  admin: {
    all: ['admin'] as const,
    statistics: ['admin', 'statistics'] as const,
    dashboard: ['admin', 'dashboard'] as const,
    technicians: {
      all: ['admin', 'technicians'] as const,
      list: (params: GetTechniciansParams) => ['admin', 'technicians', 'list', params] as const,
      detail: (id: number) => ['admin', 'technicians', 'detail', id] as const,
    },
    requests: {
      all: ['admin', 'requests'] as const,
      list: (params: GetRequestsParams) => ['admin', 'requests', 'list', params] as const,
    },
    ratings: {
      all: ['admin', 'ratings'] as const,
      list: (params: GetRatingsParams) => ['admin', 'ratings', 'list', params] as const,
    },
    users: {
      all: ['admin', 'users'] as const,
      list: (params: GetUsersParams) => ['admin', 'users', 'list', params] as const,
    },
  },
} as const
