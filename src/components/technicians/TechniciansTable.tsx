import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
import { technicianNeedsModeration, type Technician } from '../../types/technicians.api'
import { TableSkeleton } from '../common/TableSkeleton'
import { TechnicianStatusChip } from './TechnicianStatusChip'

interface TechniciansTableProps {
  rows: Technician[]
  isLoading: boolean
  loadError?: boolean
  page: number
  rowsPerPage: number
  total: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rows: number) => void
  onView: (t: Technician) => void
  onApprove: (t: Technician) => void
  onReject: (t: Technician) => void
  busyApproveId: Technician['id'] | null
  busyRejectId: Technician['id'] | null
}

const COLS = 8


function formatServices(services: string[] | undefined): string {
  if (!services?.length) return '—'
  const joined = services.join(', ')
  return joined.length > 42 ? `${joined.slice(0, 40)}…` : joined
}

export function TechniciansTable({
  rows,
  isLoading,
  loadError = false,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
  onView,
  onApprove,
  onReject,
  busyApproveId,
  busyRejectId,
}: TechniciansTableProps) {
  const showEmpty = !isLoading && rows.length === 0

  return (
    <Box>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: 'none',
          borderRadius: 0,
          overflowX: 'auto',
        }}
      >
        <Table size="medium" stickyHeader aria-label="Technicians table">
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
              <TableCell>Name</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Phone</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Services</TableCell>
              <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Availability</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} align="right">
                Rating
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton columns={COLS} />
            ) : showEmpty ? (
              <TableRow>
                <TableCell colSpan={COLS} sx={{ py: 6, textAlign: 'center' }}>
                  <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                    {loadError
                      ? 'Data could not be loaded. Use retry above or adjust filters.'
                      : 'No technicians match the current filter.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const needsAction = technicianNeedsModeration(row.status)
                const approveLoading = busyApproveId === row.id
                const rejectLoading = busyRejectId === row.id
                return (
                  <TableRow
                    key={String(row.id)}
                    hover
                    sx={{
                      '&:last-of-type td': { borderBottom: 0 },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{row.phone || '—'}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, color: 'text.secondary' }}>
                      {formatServices(row.services)}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' }, color: 'text.secondary' }}>
                      {row.availability_status ?? '—'}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, color: 'text.secondary' }} align="right">
                      {row.avg_rating != null ? Number(row.avg_rating).toFixed(1) : '—'}
                    </TableCell>
                    <TableCell>
                      <TechnicianStatusChip status={row.status} />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, color: 'text.secondary' }}>
                      {row.created_at
                        ? new Date(row.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })
                        : '—'}
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'flex-end',
                          gap: 0.75,
                        }}
                      >
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
                        {needsAction ? (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              disableElevation
                              disabled={approveLoading || rejectLoading}
                              onClick={() => onApprove(row)}
                              startIcon={
                                approveLoading ? (
                                  <CircularProgress size={14} color="inherit" />
                                ) : (
                                  <CheckRoundedIcon fontSize="small" />
                                )
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              disabled={approveLoading || rejectLoading}
                              onClick={() => onReject(row)}
                              startIcon={
                                rejectLoading ? (
                                  <CircularProgress size={14} color="error" />
                                ) : (
                                  <CloseRoundedIcon fontSize="small" />
                                )
                              }
                            >
                              Reject
                            </Button>
                          </>
                        ) : null}
                      </Box>
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
