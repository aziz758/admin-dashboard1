import type { ReactNode } from 'react'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'

export type StatAccent = 'indigo' | 'emerald' | 'amber' | 'violet'

const ACCENT: Record<StatAccent, string> = {
  indigo: '#4f46e5',
  emerald: '#059669',
  amber: '#d97706',
  violet: '#7c3aed',
}

export interface StatCardProps {
  title: string
  value: string
  subtitle: string
  icon: ReactNode
  accent: StatAccent
  trend?: 'up' | 'neutral'
}

export function StatCard({ title, value, subtitle, icon, accent, trend = 'up' }: StatCardProps) {
  const c = ACCENT[accent]

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${alpha('#0f172a', 0.06)}`,
        transition: 'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.09)',
          borderColor: alpha(c, 0.28),
          transform: 'translateY(-3px)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${c} 0%, ${alpha(c, 0.35)} 100%)`,
        },
      }}
    >
      <CardContent sx={{ pt: 3 }}>
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ pr: 1 }}>
            <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 500, mb: 0.75 }}>
              {title}
            </Typography>
            <Typography variant="h4" component="p" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
              {value}
            </Typography>
            <Stack
              spacing={0.5}
              sx={{ flexDirection: 'row', alignItems: 'center', mt: 1.25 }}
            >
              {trend === 'up' ? (
                <TrendingUpRoundedIcon
                  sx={{
                    fontSize: 18,
                    color: 'success.main',
                  }}
                  aria-hidden
                />
              ) : null}
              <Typography
                variant="caption"
                sx={{
                  color: trend === 'up' ? 'success.main' : 'text.secondary',
                  fontWeight: 600,
                }}
              >
                {subtitle}
              </Typography>
            </Stack>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              color: c,
              bgcolor: alpha(c, 0.12),
              border: `1px solid ${alpha(c, 0.15)}`,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
