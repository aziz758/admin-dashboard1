import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { AdminUserRow } from '../../types/users.api'
import { TableSkeleton } from '../common/TableSkeleton'

interface UsersTableProps {
  rows: AdminUserRow[]
  isLoading: boolean
  loadError?: boolean
  page: number
  rowsPerPage: number
  total: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rows: number) => void
  onRequestDelete: (row: AdminUserRow) => void
  busyDeleteKey: string | null
}

const COLS = 7

function userTypeChipColor(userType: AdminUserRow['user_type']): 'primary' | 'secondary' {
  return userType === 'customer' ? 'primary' : 'secondary'
}

function statusChipColor(status: string): 'success' | 'default' | 'warning' | 'error' {
  const s = status.toLowerCase()
  if (s === 'active') return 'success'
  if (s === 'inactive') return 'default'
  if (s === 'pending' || s.includes('pending')) return 'warning'
  return 'default'
}

export function UsersTable({
  rows,
  isLoading,
  loadError = false,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
  onRequestDelete,
  busyDeleteKey,
}: UsersTableProps) {
  const showEmpty = !isLoading && rows.length === 0

  return (
    <Box>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: 'none', borderRadius: 0, overflowX: 'auto' }}
      >
        <Table size="medium" stickyHeader aria-label="Users table">
          <TableHead>
            <TableRow
              sx={{
                '& th': {
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                  bgcolor: alpha('#f1f5f9', 0.9),
                  borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}`,
                },
              }}
            >
              <TableCell width={72}>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Phone</TableCell>
              <TableCell>Type</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Status</TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Joined</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={COLS} rows={8} />
            ) : showEmpty ? (
              <TableRow>
                <TableCell colSpan={COLS} sx={{ py: 6, textAlign: 'center' }}>
                  <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                    {loadError
                      ? 'Data could not be loaded. Use retry above or adjust filters.'
                      : 'No users match the current filters.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const rowKey = `${row.user_type}-${row.id}`
                const busy = busyDeleteKey === rowKey
                return (
                  <TableRow key={rowKey} hover sx={{ '&:last-of-type td': { borderBottom: 0 } }}>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>{row.id}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {row.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: { xs: 'block', sm: 'none' } }}
                      >
                        {row.phone}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, color: 'text.secondary' }}>
                      {row.phone}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.user_type}
                        size="small"
                        color={userTypeChipColor(row.user_type)}
                        variant="outlined"
                        sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      <Chip
                        label={row.status}
                        size="small"
                        color={statusChipColor(row.status)}
                        sx={{ fontWeight: 600, textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, color: 'text.secondary' }}>
                      {row.created_at
                        ? new Date(row.created_at).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })
                        : '—'}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Soft delete (recoverable on backend rules)">
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          disabled={busy}
                          onClick={() => onRequestDelete(row)}
                          startIcon={
                            busy ? <CircularProgress color="inherit" size={14} /> : <DeleteOutlineRoundedIcon />
                          }
                        >
                          Delete
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25, 50]}
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => onRowsPerPageChange(Number.parseInt(e.target.value, 10))}
        sx={{
          borderTop: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}`,
          px: 1,
        }}
      />
    </Box>
  )
}
