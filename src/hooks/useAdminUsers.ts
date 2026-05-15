import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../constants/queryKeys'
import { getUsers } from '../services/adminService'
import type { GetUsersParams } from '../types/users.api'

export function useAdminUsers(params: GetUsersParams) {
  return useQuery({
    queryKey: queryKeys.admin.users.list(params),
    queryFn: () => getUsers(params),
    placeholderData: (previousData) => previousData,
  })
}
