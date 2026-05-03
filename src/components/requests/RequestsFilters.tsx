import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { REQUEST_STATUSES, type RequestStatus } from '../../types/requests.api'

const LABEL: Record<RequestStatus, string> = {
  pending: 'Pending',
  assigned: 'Assigned',
  accepted: 'Accepted',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const OPTIONS: { value: '' | RequestStatus; label: string }[] = [
  { value: '', label: 'All statuses' },
  ...REQUEST_STATUSES.map((s) => ({
    value: s,
    label: LABEL[s],
  })),
]

interface RequestsFiltersProps {
  status: '' | RequestStatus
  onStatusChange: (value: '' | RequestStatus) => void
  total: number
  isLoading: boolean
}

export function RequestsFilters({ status, onStatusChange, total, isLoading }: RequestsFiltersProps) {
  return (
    <Stack
      sx={{
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        p: { xs: 2, sm: 2.5 },
        borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}`,
        bgcolor: alpha('#f8fafc', 0.65),
      }}
    >
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Service requests
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isLoading ? 'Loading…' : `${total.toLocaleString()} request${total === 1 ? '' : 's'} found`}
        </Typography>
      </Box>

      <Stack
        spacing={1}
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          minWidth: { xs: '100%', sm: 260 },
        }}
      >
        <FilterListRoundedIcon sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }} />
        <FormControl size="small" fullWidth>
          <InputLabel id="request-status-filter">Status</InputLabel>
          <Select
            labelId="request-status-filter"
            label="Status"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as '' | RequestStatus)}
          >
            {OPTIONS.map((opt) => (
              <MenuItem key={String(opt.value) + opt.label} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  )
}
