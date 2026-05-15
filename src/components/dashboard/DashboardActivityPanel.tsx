import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import EngineeringRoundedIcon from '@mui/icons-material/EngineeringRounded'
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'
import HubRoundedIcon from '@mui/icons-material/HubRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { DashboardActivityContent, DashboardActivityItem } from '../../mappers/mapAdminDashboardContent'
import { QueryErrorAlert } from './QueryErrorAlert'

const ACCENT = '#4f46e5'

const ACTIVITY_KIND = {
  request: { Icon: AssignmentRoundedIcon, color: '#4f46e5' },
  technician: { Icon: EngineeringRoundedIcon, color: '#7c3aed' },
  customer: { Icon: PersonRoundedIcon, color: '#059669' },
  rating: { Icon: StarRoundedIcon, color: '#d97706' },
  system: { Icon: HubRoundedIcon, color: '#64748b' },
} as const

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
      <Card
        sx={{
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}`,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${ACCENT} 0%, ${alpha(ACCENT, 0.35)} 100%)`,
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3 }, pt: 3.25 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 2.5, alignItems: 'center' }}>
            <Skeleton variant="rounded" width={48} height={48} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="55%" height={28} />
              <Skeleton variant="text" width="80%" height={20} />
            </Box>
            <Skeleton variant="rounded" width={56} height={28} />
          </Stack>
          <Stack spacing={0}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Stack
                key={i}
                direction="row"
                spacing={2}
                sx={{
                  py: 1.75,
                  alignItems: 'flex-start',
                  borderTop: i === 0 ? 'none' : (t) => `1px solid ${alpha(t.palette.divider, 0.65)}`,
                }}
              >
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="92%" height={22} />
                  <Skeleton variant="text" width="40%" height={18} sx={{ mt: 0.5 }} />
                </Box>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}

function RecentActivityCard({ items }: { items: DashboardActivityItem[] }) {
  const count = items.length

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}`,
        boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.09)',
          borderColor: alpha(ACCENT, 0.22),
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${ACCENT} 0%, ${alpha(ACCENT, 0.35)} 100%)`,
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 }, pt: 3.25 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{
            mb: 1,
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
                color: ACCENT,
                bgcolor: alpha(ACCENT, 0.1),
                border: `1px solid ${alpha(ACCENT, 0.14)}`,
              }}
            >
              <HistoryRoundedIcon sx={{ fontSize: 26 }} aria-hidden />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Recent activity
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35, maxWidth: 360 }}>
                Live feed of requests, technicians, and ratings from your admin API.
              </Typography>
            </Box>
          </Stack>
          {count > 0 ? (
            <Chip
              size="small"
              label={`${count} ${count === 1 ? 'item' : 'items'}`}
              sx={{
                fontWeight: 700,
                bgcolor: alpha(ACCENT, 0.1),
                color: 'primary.dark',
                border: `1px solid ${alpha(ACCENT, 0.2)}`,
              }}
            />
          ) : null}
        </Stack>

        {items.length === 0 ? (
          <Box
            sx={{
              py: 5,
              px: 2,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: alpha('#0f172a', 0.02),
              border: (t) => `1px dashed ${alpha(t.palette.divider, 0.9)}`,
            }}
          >
            <HubRoundedIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} aria-hidden />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              No activity yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280, mx: 'auto' }}>
              When the backend sends <code style={{ fontSize: '0.85em' }}>recent_activity</code> or{' '}
              <code style={{ fontSize: '0.85em' }}>recent_requests</code>, entries will show up here.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              maxHeight: 360,
              overflow: 'auto',
              mr: -0.5,
              pr: 0.5,
              '&::-webkit-scrollbar': { width: 6 },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: alpha('#64748b', 0.35),
                borderRadius: 3,
              },
            }}
          >
            <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
              {items.map((item, index) => {
                const { Icon, color } = ACTIVITY_KIND[item.kind]
                return (
                  <Box
                    component="li"
                    key={item.id}
                    sx={{
                      py: 1.75,
                      borderTop:
                        index === 0 ? 'none' : (t) => `1px solid ${alpha(t.palette.divider, 0.65)}`,
                      transition: 'background-color 0.15s ease',
                      borderRadius: 1,
                      mx: -1,
                      px: 1,
                      '&:hover': {
                        bgcolor: alpha('#0f172a', 0.03),
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          flexShrink: 0,
                          display: 'grid',
                          placeItems: 'center',
                          color,
                          bgcolor: alpha(color, 0.12),
                          border: `1px solid ${alpha(color, 0.18)}`,
                        }}
                      >
                        <Icon sx={{ fontSize: 20 }} aria-hidden />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={0.5}
                          sx={{
                            alignItems: { xs: 'flex-start', sm: 'flex-start' },
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: 'text.primary',
                              lineHeight: 1.45,
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {item.title}
                          </Typography>
                          {item.meta ? (
                            <Typography
                              variant="caption"
                              sx={{
                                flexShrink: 0,
                                color: 'text.secondary',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {item.meta}
                            </Typography>
                          ) : null}
                        </Stack>
                        {item.subtitle ? (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 0.5, display: 'block', fontWeight: 500 }}
                          >
                            {item.subtitle}
                          </Typography>
                        ) : null}
                      </Box>
                    </Stack>
                  </Box>
                )
              })}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
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

            <RecentActivityCard items={content.activityItems} />
          </Stack>
        )}
      </Box>
    </Box>
  )
}
