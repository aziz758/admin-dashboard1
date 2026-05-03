import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../constants/queryKeys'
import { getRequests } from '../services/adminService'
import type { GetRequestsParams } from '../types/requests.api'

export function useAdminRequests(params: GetRequestsParams) {
  return useQuery({
    queryKey: queryKeys.admin.requests.list(params),
    queryFn: () => getRequests(params),
    placeholderData: (previousData) => previousData,
  })
}
