import Chip from '@mui/material/Chip'
import type { TechnicianStatus } from '../../types/technicians.api'

const STATUS_LABEL: Record<TechnicianStatus, string> = {
  pending_approval: 'Pending approval',
  pending_documents: 'Pending documents',
  approved: 'Approved',
  rejected: 'Rejected',
}

const STATUS_COLOR: Record<
  TechnicianStatus,
  'default' | 'primary' | 'success' | 'warning' | 'error'
> = {
  pending_approval: 'warning',
  pending_documents: 'primary',
  approved: 'success',
  rejected: 'error',
}

interface TechnicianStatusChipProps {
  status: TechnicianStatus
  size?: 'small' | 'medium'
}

export function TechnicianStatusChip({ status, size = 'small' }: TechnicianStatusChipProps) {
  return (
    <Chip
      label={STATUS_LABEL[status]}
      color={STATUS_COLOR[status]}
      size={size}
      variant={status === 'approved' ? 'outlined' : 'filled'}
      sx={{ fontWeight: 600 }}
    />
  )
}
