import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
import type { AdminRequest } from '../../types/requests.api'
import { TableSkeleton } from '../common/TableSkeleton'
import { RequestStatusBadge } from './RequestStatusBadge'

interface RequestsTableProps {
  rows: AdminRequest[]
  isLoading: boolean
  loadError?: boolean
  page: number
  rowsPerPage: number
  total: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rows: number) => void
  onView: (row: AdminRequest) => void
}

const COLS = 6


export function RequestsTable({
  rows,
  isLoading,
  loadError = false,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
  onView,
}: RequestsTableProps) {
  const showEmpty = !isLoading && rows.length === 0

  return (
    <Box>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: 'none', borderRadius: 0, overflowX: 'auto' }}
      >
        <Table size="medium" stickyHeader aria-label="Requests table">
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
              <TableCell width={88}>ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Technician</TableCell>
              <TableCell>Status</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Date</TableCell>
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
                      : 'No requests match the current filter.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:last-of-type td': { borderBottom: 0 } }}>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>#{row.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {row.customer_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {row.customer_phone ?? '—'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.technician_name ?? '—'}
                    </Typography>
                    {row.technician_phone ? (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {row.technician_phone}
                      </Typography>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <RequestStatusBadge status={row.status} />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, color: 'text.secondary' }}>
                    {row.created_at
                      ? new Date(row.created_at).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : '—'}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View details">
                      <Button
                        size="small"
                        variant="outlined"
                        color="inherit"
                        onClick={() => onView(row)}
                        startIcon={<VisibilityOutlinedIcon fontSize="small" />}
                      >
                        View
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
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
