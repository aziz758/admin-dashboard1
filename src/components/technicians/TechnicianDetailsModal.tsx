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
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { technicianNeedsModeration, type Technician } from '../../types/technicians.api'
import { DetailRow } from '../common/DetailRow'
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
  const [showRejectField, setShowRejectField] = useState(false)

  useEffect(() => {
    if (open && startWithReject) {
      setShowRejectField(true)
    }
    if (!open) {
      setRejectReason('')
      setShowRejectField(false)
    }
  }, [open, startWithReject, technician?.id])

  const handleClose = () => {
    setRejectReason('')
    setShowRejectField(false)
    onClose()
  }

  const canModerate = technician ? technicianNeedsModeration(technician.status) : false
  const pendingCustomCount = technician?.pending_custom_service_requests_count ?? 0

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
                The backend may block approval until those are reviewed.
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
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Custom service requests
                </Typography>
                <Stack spacing={1}>
                  {technician.custom_service_requests.map((req) => (
                    <Box
                      key={req.id}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}`,
                        bgcolor: alpha('#f8fafc', 0.8),
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {req.requested_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Status: {req.status}
                        {req.created_at ? ` · ${req.created_at}` : ''}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
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
            <Button
              variant="contained"
              disableElevation
              color="success"
              disabled={isRejecting || showRejectField || isApproving}
              onClick={() => onApprove(technician.id)}
              startIcon={
                isApproving ? <CircularProgress color="inherit" size={16} /> : undefined
              }
            >
              Approve
            </Button>
          </>
        ) : null}
      </DialogActions>
    </Dialog>
  )
}
