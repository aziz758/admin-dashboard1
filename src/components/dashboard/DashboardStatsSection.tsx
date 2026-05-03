import Box from '@mui/material/Box'
import type { StatCardProps } from './StatCard'
import { StatCard } from './StatCard'
import { DashboardStatGridSkeleton } from './StatCardSkeleton'
import { QueryErrorAlert } from './QueryErrorAlert'

interface DashboardStatsSectionProps {
  isLoading: boolean
  error: unknown
  statCards: StatCardProps[] | undefined
  onRetry: () => void | Promise<void>
}

export function DashboardStatsSection({
  isLoading,
  error,
  statCards,
  onRetry,
}: DashboardStatsSectionProps) {
  if (error) {
    return (
      <QueryErrorAlert
        error={error}
        onRetry={onRetry}
        title="Could not load statistics"
      />
    )
  }

  if (isLoading || !statCards) {
    return <DashboardStatGridSkeleton />
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: { xs: 2, sm: 2.5 },
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        },
      }}
    >
      {statCards.map((props) => (
        <StatCard key={props.title} {...props} />
      ))}
    </Box>
  )
}
