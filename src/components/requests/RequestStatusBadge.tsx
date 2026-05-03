import Chip from '@mui/material/Chip'
import type { RequestStatus } from '../../types/requests.api'

const LABEL: Record<RequestStatus, string> = {
  pending: 'Pending',
  assigned: 'Assigned',
  accepted: 'Accepted',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const COLOR: Record<RequestStatus, 'default' | 'warning' | 'primary' | 'success' | 'error'> = {
  pending: 'warning',
  assigned: 'primary',
  accepted: 'success',
  completed: 'success',
  cancelled: 'error',
}

interface RequestStatusBadgeProps {
  status: RequestStatus
  size?: 'small' | 'medium'
}

export function RequestStatusBadge({ status, size = 'small' }: RequestStatusBadgeProps) {
  return (
    <Chip
      label={LABEL[status]}
      color={COLOR[status]}
      size={size}
      variant={status === 'completed' || status === 'cancelled' ? 'filled' : 'outlined'}
      sx={{ fontWeight: 600 }}
    />
  )
}
