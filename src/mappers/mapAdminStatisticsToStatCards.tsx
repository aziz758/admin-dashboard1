import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import type { StatCardProps } from '../components/dashboard/StatCard'
import type { AdminStatisticsResponse } from '../types/admin.api'
import {
  formatNewToday,
  formatPercentChange,
  formatRatingSubtitle,
} from '../utils/formatStatSubtitle'

function formatCount(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 1 })
}

/** Prefer legacy keys when present; otherwise map §7.2 field names so render never sees `undefined`. */
function pickNonNegative(...vals: Array<number | undefined | null>): number {
  for (const v of vals) {
    const x = Number(v)
    if (Number.isFinite(x) && x >= 0) return x
  }
  return 0
}

export function mapAdminStatisticsToStatCards(
  stats: AdminStatisticsResponse,
): StatCardProps[] {
  const activeTechnicians = pickNonNegative(
    stats.active_technicians,
    stats.total_technicians,
  )
  const pipelineSum =
    pickNonNegative(stats.pending_requests) + pickNonNegative(stats.assigned_requests)
  const openPipeline = pickNonNegative(stats.open_requests, pipelineSum)
  const registeredUsers = pickNonNegative(stats.registered_users, stats.total_customers)
  const ratingRaw = stats.average_rating ?? stats.avg_rating_platform
  const techChange = stats.technicians_change_percent
  const usersChange = stats.users_change_percent

  return [
    {
      title: 'Active technicians',
      value: formatCount(activeTechnicians),
      subtitle:
        stats.pending_approval_count != null && Number.isFinite(stats.pending_approval_count)
          ? `${stats.pending_approval_count.toLocaleString()} pending approval`
          : formatPercentChange(techChange ?? null),
      accent: 'indigo',
      trend: techChange != null && techChange > 0 ? 'up' : 'neutral',
      icon: <EngineeringOutlinedIcon sx={{ fontSize: 26 }} />,
    },
    {
      title: 'Open requests',
      value: formatCount(openPipeline),
      subtitle: formatNewToday(stats.requests_new_today ?? null),
      accent: 'amber',
      trend:
        stats.requests_new_today != null && stats.requests_new_today > 0 ? 'up' : 'neutral',
      icon: <AssignmentOutlinedIcon sx={{ fontSize: 26 }} />,
    },
    {
      title: 'Registered users',
      value: formatCount(registeredUsers),
      subtitle: formatPercentChange(usersChange ?? null),
      accent: 'emerald',
      trend: usersChange != null && usersChange > 0 ? 'up' : 'neutral',
      icon: <PeopleOutlinedIcon sx={{ fontSize: 26 }} />,
    },
    {
      title: 'Avg. rating',
      value: Number.isFinite(Number(ratingRaw)) ? Number(ratingRaw).toFixed(1) : '—',
      subtitle: formatRatingSubtitle(),
      accent: 'violet',
      trend: 'neutral',
      icon: <StarRoundedIcon sx={{ fontSize: 26 }} />,
    },
  ]
}
