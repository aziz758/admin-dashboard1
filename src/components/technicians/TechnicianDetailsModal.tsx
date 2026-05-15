import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { useState } from 'react'
import { technicianNeedsModeration, type Technician } from '../../types/technicians.api'
import { DetailRow } from '../common/DetailRow'
import { CustomServiceRequestsReview } from './CustomServiceRequestsReview'
import { TechnicianIdCardPreview } from './TechnicianIdCardPreview'
import { TechnicianStatusChip } from './TechnicianStatusChip'

interface TechnicianDetailsModalProps {
  open: boolean
  technician: Technician | null
  /** Shown while `GET /admin/technicians/:id` is refetching */
  isDetailFetching?: boolean
  onClose: () => void
  onApprove: (id: Technician['id']) => void
  onReject: (id: Technician['id'], reason?: string | null) => void
  isApproving: boolean
  isRejecting: boolean
  startWithReject?: boolean
}


export function TechnicianDetailsModal({
  open,
  technician,
  isDetailFetching = false,
  onClose,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
  startWithReject = false,
}: TechnicianDetailsModalProps) {
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectField, setShowRejectField] = useState(startWithReject)

  const handleClose = () => {
    setRejectReason('')
    setShowRejectField(false)
    onClose()
  }

  const canModerate = technician ? technicianNeedsModeration(technician.status) : false
  const pendingCustomCount = technician?.pending_custom_service_requests_count ?? 0
  const approveBlockedByCustomServices = canModerate && pendingCustomCount > 0

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}`,
          },
        },
      }}
    >
      <DialogTitle sx={{ pr: 6, fontWeight: 700 }}>
        Technician details
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ position: 'relative' }}>
        {isDetailFetching ? (
          <LinearProgress
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              borderRadius: 0,
            }}
          />
        ) : null}
        {!technician ? null : (
          <Stack spacing={2.5}>
            <Stack
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {technician.name}
              </Typography>
              <TechnicianStatusChip status={technician.status} size="medium" />
            </Stack>

            {pendingCustomCount > 0 ? (
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                This technician has <strong>{pendingCustomCount}</strong> pending custom service request(s).
                Review them below — the server blocks account approval until none are pending (see integration
                guide §7.7).
              </Alert>
            ) : null}

            <Stack spacing={2}>
              <DetailRow label="Phone" value={technician.phone} />
              <DetailRow label="Availability" value={technician.availability_status} />
              <DetailRow
                label="Avg rating"
                value={
                  technician.avg_rating != null ? String(Number(technician.avg_rating).toFixed(2)) : undefined
                }
              />
              <DetailRow
                label="Ratings count"
                value={technician.total_ratings != null ? String(technician.total_ratings) : undefined}
              />
              <DetailRow
                label="Acceptance / Completion"
                value={
                  technician.acceptance_rate != null || technician.completion_rate != null
                    ? `${technician.acceptance_rate ?? '—'}% / ${technician.completion_rate ?? '—'}%`
                    : undefined
                }
              />
              <DetailRow label="Service radius (km)" value={technician.service_radius_km?.toString()} />
              <DetailRow
                label="Working hours"
                value={
                  technician.work_start_time || technician.work_end_time
                    ? `${technician.work_start_time ?? '?'} – ${technician.work_end_time ?? '?'}`
                    : undefined
                }
              />
              <DetailRow
                label="Created"
                value={
                  technician.created_at
                    ? new Date(technician.created_at).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                    : undefined
                }
              />
            </Stack>

            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: '0.04em' }}>
                Services
              </Typography>
              <Stack sx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
                {technician.services?.length ? (
                  technician.services.map((s) => (
                    <Chip key={s} label={s} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    —
                  </Typography>
                )}
              </Stack>
            </Box>

            <TechnicianIdCardPreview technicianId={technician.id} active={open} />

            {technician.custom_service_requests?.length ? (
              <CustomServiceRequestsReview
                technicianId={technician.id}
                requests={technician.custom_service_requests}
              />
            ) : null}

            {canModerate && showRejectField ? (
              <Box sx={{ pt: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Rejection note (optional)
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  If provided, sent to the server as <code>admin_note</code> with the reject status.
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  placeholder="Reason for rejection…"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  slotProps={{ input: { sx: { borderRadius: 2 } } }}
                />
              </Box>
            ) : null}
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, gap: 1, flexWrap: 'wrap' }}>
        <Button onClick={handleClose} color="inherit">
          Close
        </Button>
        <Box sx={{ flex: 1 }} />
        {technician && canModerate ? (
          <>
            {!showRejectField ? (
              <Button
                color="error"
                variant="outlined"
                disabled={isApproving || isRejecting}
                onClick={() => setShowRejectField(true)}
              >
                Reject
              </Button>
            ) : (
              <>
                <Button color="inherit" onClick={() => setShowRejectField(false)} disabled={isRejecting}>
                  Cancel reject
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  disableElevation
                  disabled={isApproving || isRejecting}
                  onClick={() => {
                    onReject(technician.id, rejectReason.trim() || undefined)
                  }}
                  startIcon={
                    isRejecting ? <CircularProgress color="inherit" size={16} /> : undefined
                  }
                >
                  Confirm reject
                </Button>
              </>
            )}
            <Tooltip
              title={
                approveBlockedByCustomServices
                  ? 'Review all pending custom service requests below before approving this technician.'
                  : ''
              }
            >
              <span>
                <Button
                  variant="contained"
                  disableElevation
                  color="success"
                  disabled={
                    isRejecting || showRejectField || isApproving || approveBlockedByCustomServices
                  }
                  onClick={() => onApprove(technician.id)}
                  startIcon={
                    isApproving ? <CircularProgress color="inherit" size={16} /> : undefined
                  }
                >
                  Approve
                </Button>
              </span>
            </Tooltip>
          </>
        ) : null}
      </DialogActions>
    </Dialog>
  )
}
