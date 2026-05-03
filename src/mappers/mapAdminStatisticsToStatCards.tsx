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

export function mapAdminStatisticsToStatCards(
  stats: AdminStatisticsResponse,
): StatCardProps[] {
  const techChange = stats.technicians_change_percent
  const usersChange = stats.users_change_percent

  return [
    {
      title: 'Active technicians',
      value: formatCount(stats.active_technicians),
      subtitle: formatPercentChange(techChange ?? null),
      accent: 'indigo',
      trend: techChange != null && techChange > 0 ? 'up' : 'neutral',
      icon: <EngineeringOutlinedIcon sx={{ fontSize: 26 }} />,
    },
    {
      title: 'Open requests',
      value: formatCount(stats.open_requests),
      subtitle: formatNewToday(stats.requests_new_today ?? null),
      accent: 'amber',
      trend:
        stats.requests_new_today != null && stats.requests_new_today > 0 ? 'up' : 'neutral',
      icon: <AssignmentOutlinedIcon sx={{ fontSize: 26 }} />,
    },
    {
      title: 'Registered users',
      value: formatCount(stats.registered_users),
      subtitle: formatPercentChange(usersChange ?? null),
      accent: 'emerald',
      trend: usersChange != null && usersChange > 0 ? 'up' : 'neutral',
      icon: <PeopleOutlinedIcon sx={{ fontSize: 26 }} />,
    },
    {
      title: 'Avg. rating',
      value: Number.isFinite(stats.average_rating)
        ? stats.average_rating.toFixed(1)
        : '—',
      subtitle: formatRatingSubtitle(),
      accent: 'violet',
      trend: 'neutral',
      icon: <StarRoundedIcon sx={{ fontSize: 26 }} />,
    },
  ]
}
