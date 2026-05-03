import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../constants/queryKeys'
import { getTechnicians } from '../services/adminService'
import type { GetTechniciansParams } from '../types/technicians.api'

export function useTechnicians(params: GetTechniciansParams) {
  return useQuery({
    queryKey: queryKeys.admin.technicians.list(params),
    queryFn: () => getTechnicians(params),
    placeholderData: (previousData) => previousData,
  })
}
