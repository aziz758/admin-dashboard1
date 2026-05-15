import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { AdminDirectoryUserType } from '../../types/users.api'

export type UsersFilterType = '' | AdminDirectoryUserType

interface UsersFiltersProps {
  userType: UsersFilterType
  onUserTypeChange: (value: UsersFilterType) => void
  searchInput: string
  onSearchInputChange: (value: string) => void
  total: number
  isLoading: boolean
}

const TYPE_OPTIONS: { value: UsersFilterType; label: string }[] = [
  { value: '', label: 'All types' },
  { value: 'customer', label: 'Customers' },
  { value: 'technician', label: 'Technicians' },
]

export function UsersFilters({
  userType,
  onUserTypeChange,
  searchInput,
  onSearchInputChange,
  total,
  isLoading,
}: UsersFiltersProps) {
  return (
    <Stack
      sx={{
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'flex-end' },
        justifyContent: 'space-between',
        gap: 2,
        p: { xs: 2, sm: 2.5 },
        borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}`,
        bgcolor: alpha('#f8fafc', 0.65),
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Directory
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isLoading ? 'Loading users…' : `${total.toLocaleString()} user${total === 1 ? '' : 's'} found`}
        </Typography>
      </Box>

      <Stack
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          width: { xs: '100%', md: 'auto' },
          minWidth: { md: 420 },
        }}
      >
        <FilterListRoundedIcon sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }} />
        <TextField
          size="small"
          label="Search"
          placeholder="Name or phone…"
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          sx={{ flex: 1, minWidth: { sm: 200 } }}
        />
        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 160 } }}>
          <InputLabel id="users-type-filter">User type</InputLabel>
          <Select
            labelId="users-type-filter"
            label="User type"
            value={userType}
            onChange={(e) => onUserTypeChange(e.target.value as UsersFilterType)}
          >
            {TYPE_OPTIONS.map((opt) => (
              <MenuItem key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Stack>
  )
}
