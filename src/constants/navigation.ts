import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined'
import type { NavItem } from '../types/navigation'
import { ROUTES } from '../routes/paths'

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.dashboard, Icon: DashboardOutlinedIcon },
  { label: 'Technicians', path: ROUTES.technicians, Icon: EngineeringOutlinedIcon },
  { label: 'Requests', path: ROUTES.requests, Icon: AssignmentOutlinedIcon },
  { label: 'Users', path: ROUTES.users, Icon: PeopleOutlinedIcon },
  { label: 'Ratings', path: ROUTES.ratings, Icon: StarOutlineOutlinedIcon },
  {
    label: 'Notifications',
    path: ROUTES.notifications,
    Icon: NotificationsOutlinedIcon,
  },
]
