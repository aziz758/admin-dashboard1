import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../constants/queryKeys'
import { mapAdminStatisticsToStatCards } from '../mappers/mapAdminStatisticsToStatCards'
import { getStatistics } from '../services/adminService'

export function useAdminStatistics() {
  const query = useQuery({
    queryKey: queryKeys.admin.statistics,
    queryFn: getStatistics,
  })

  const statCards = useMemo(
    () => (query.data ? mapAdminStatisticsToStatCards(query.data) : undefined),
    [query.data],
  )

  return { ...query, statCards }
}
