import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import { alpha } from '@mui/material/styles'

export function StatCardSkeleton() {
  return (
    <Card
      sx={{
        height: '100%',
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}`,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          display: 'block',
          height: 4,
          bgcolor: alpha('#64748b', 0.25),
        },
      }}
    >
      <CardContent sx={{ pt: 3 }}>
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1, pr: 1 }}>
            <Skeleton variant="text" width="55%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="65%" height={18} />
          </Box>
          <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: 2.5 }} />
        </Stack>
      </CardContent>
    </Card>
  )
}

export function DashboardStatGridSkeleton() {
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
      {Array.from({ length: 4 }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </Box>
  )
}
