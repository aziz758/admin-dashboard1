import type { GetRequestsParams } from '../types/requests.api'
import type { GetTechniciansParams } from '../types/technicians.api'

export const queryKeys = {
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
  },
} as const
