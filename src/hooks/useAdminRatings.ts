import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../constants/queryKeys'
import { getRatings } from '../services/adminService'
import type { GetRatingsParams } from '../types/ratings.api'

export function useAdminRatings(params: GetRatingsParams) {
  return useQuery({
    queryKey: queryKeys.admin.ratings.list(params),
    queryFn: () => getRatings(params),
    placeholderData: (previousData) => previousData,
  })
}
