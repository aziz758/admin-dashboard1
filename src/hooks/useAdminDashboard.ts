import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../constants/queryKeys'
import { mapAdminDashboardContent } from '../mappers/mapAdminDashboardContent'
import { getDashboard } from '../services/adminService'

export function useAdminDashboard() {
  const query = useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: getDashboard,
  })

  const content = useMemo(
    () => (query.data ? mapAdminDashboardContent(query.data) : undefined),
    [query.data],
  )

  return { ...query, content }
}
