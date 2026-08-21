import Stack from '@mui/material/Stack'
import { useAdminDashboard } from '../hooks/useAdminDashboard'
import { useAdminStatistics } from '../hooks/useAdminStatistics'
import { useQueryErrorToast } from '../hooks/useQueryErrorToast'
import { PageHeader } from '../components/dashboard/PageHeader'
import { DashboardActivityPanel } from '../components/dashboard/DashboardActivityPanel'
import { DashboardStatsSection } from '../components/dashboard/DashboardStatsSection'
import { getErrorMessage } from '../utils/errorMessage'
import { toastError, toastSuccess, TOAST_IDS } from '../utils/toast'

export function DashboardPage() {
  const statisticsQuery = useAdminStatistics()
  const dashboardQuery = useAdminDashboard()

  useQueryErrorToast(statisticsQuery.isError, statisticsQuery.error, TOAST_IDS.adminStatisticsError)
  useQueryErrorToast(dashboardQuery.isError, dashboardQuery.error, TOAST_IDS.adminDashboardError)

  const handleRetryStatistics = async () => {
    const result = await statisticsQuery.refetch()
    if (result.isError) {
      toastError(getErrorMessage(result.error))
    } else {
      toastSuccess('Statistics updated')
    }
  }

  const handleRetryDashboard = async () => {
    const result = await dashboardQuery.refetch()
    if (result.isError) {
      toastError(getErrorMessage(result.error))
    } else {
      toastSuccess('Dashboard data updated')
    }
  }

  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      <PageHeader
        eyebrow="Dashboard"
        title="Overview"
        description="Monitor technicians, service requests, and customer satisfaction in one place. Figures below load from your admin API."

      />

      <DashboardStatsSection
        isLoading={statisticsQuery.isPending}
        error={statisticsQuery.isError ? statisticsQuery.error : undefined}
        statCards={statisticsQuery.statCards}
        onRetry={handleRetryStatistics}
      />

      <DashboardActivityPanel
        isLoading={dashboardQuery.isPending}
        error={dashboardQuery.isError ? dashboardQuery.error : undefined}
        content={dashboardQuery.content}
        onRetry={handleRetryDashboard}
      />
    </Stack>
  )
}
