import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../constants/queryKeys'
import { getTechnicianById } from '../services/adminService'

export function useTechnicianDetail(technicianId: number | null, enabled: boolean) {
  return useQuery({
    queryKey: technicianId != null ? queryKeys.admin.technicians.detail(technicianId) : ['admin', 'technicians', 'detail', 'none'],
    queryFn: () => getTechnicianById(technicianId!),
    enabled: Boolean(enabled && technicianId != null),
  })
}
