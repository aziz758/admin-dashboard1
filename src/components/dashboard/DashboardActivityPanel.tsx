import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { DashboardActivityContent } from '../../mappers/mapAdminDashboardContent'
import { QueryErrorAlert } from './QueryErrorAlert'

interface DashboardActivityPanelProps {
  isLoading: boolean
  error: unknown
  content: DashboardActivityContent | undefined
  onRetry: () => void | Promise<void>
}

function ActivitySkeleton() {
  return (
    <Stack spacing={2}>
      <Card sx={{ border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}` }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Skeleton variant="text" width="30%" height={24} />
          <Skeleton variant="text" width="70%" height={28} sx={{ my: 1 }} />
          <Skeleton variant="rounded" height={72} />
        </CardContent>
      </Card>
      <Card sx={{ border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}` }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Skeleton variant="text" width="45%" height={26} sx={{ mb: 2 }} />
          <Stack spacing={1.5}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="text" height={22} sx={{ width: i === 1 ? '85%' : '100%' }} />
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

export function DashboardActivityPanel({
  isLoading,
  error,
  content,
  onRetry,
}: DashboardActivityPanelProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: { xs: 2, md: 2.5 },
        gridTemplateColumns: { xs: '1fr', md: '1.35fr 1fr' },
      }}
    >
      <Card
        sx={{
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}`,
          boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Activity &amp; trends
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 520 }}>
            Drop in charts from Recharts or your analytics stack here. This panel is sized for a weekly volume chart
            or funnel breakdown.
          </Typography>
          <Box
            sx={{
              height: 220,
              borderRadius: 2,
              bgcolor: alpha('#4f46e5', 0.04),
              border: `1px dashed ${alpha('#4f46e5', 0.22)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Chart placeholder
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box>
        {error ? (
          <QueryErrorAlert
            error={error}
            onRetry={onRetry}
            title="Could not load dashboard extras"
          />
        ) : isLoading || !content ? (
          <ActivitySkeleton />
        ) : (
          <Stack spacing={2}>
            <Card
              sx={{
                border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}`,
                background: `linear-gradient(145deg, ${alpha('#4f46e5', 0.06)} 0%, #ffffff 48%)`,
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                {content.insight ? (
                  <>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      sx={{ fontWeight: 700, letterSpacing: '0.06em', mb: 1 }}
                    >
                      QUICK INSIGHT
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                      {content.insight.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {content.insight.body}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      sx={{ fontWeight: 700, letterSpacing: '0.06em', mb: 1 }}
                    >
                      QUICK INSIGHT
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      No SLA insight payload was returned. Add `sla_insight_title` / `sla_insight_body` or
                      `sla_compliance_percent` on the dashboard API.
                    </Typography>
                  </>
                )}
                <Button variant="outlined" color="primary" fullWidth sx={{ fontWeight: 600 }}>
                  View at-risk jobs
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}` }}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700 }}>
                  Recent activity
                </Typography>
                {content.activityLines.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No recent activity yet.
                  </Typography>
                ) : (
                  <Stack spacing={1.75}>
                    {content.activityLines.map((line) => (
                      <Box
                        key={line}
                        sx={{
                          pl: 2,
                          borderLeft: `3px solid ${alpha('#4f46e5', 0.35)}`,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {line}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Stack>
        )}
      </Box>
    </Box>
  )
}
