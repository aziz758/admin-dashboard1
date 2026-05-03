import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import type { AdminRequest } from '../../types/requests.api'
import { publicAssetUrl } from '../../utils/publicAssetUrl'
import { DetailRow } from '../common/DetailRow'
import { RequestStatusBadge } from './RequestStatusBadge'

interface RequestDetailsModalProps {
  open: boolean
  request: AdminRequest | null
  onClose: () => void
}


export function RequestDetailsModal({ open, request, onClose }: RequestDetailsModalProps) {
  const imageSrc = request?.image_url ? publicAssetUrl(request.image_url) : null

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        Request #{request?.id ?? ''}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {!request ? null : (
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
                {request.customer_name}
              </Typography>
              <RequestStatusBadge status={request.status} size="medium" />
            </Stack>

            {imageSrc ? (
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}`,
                  maxHeight: 280,
                }}
              >
                <Box
                  component="img"
                  src={imageSrc}
                  alt=""
                  sx={{ width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block' }}
                />
              </Box>
            ) : null}

            <Stack spacing={2}>
              <DetailRow label="Note" value={request.note} multiline />
              <DetailRow label="Address" value={request.address} />
              <DetailRow
                label="Location"
                value={
                  request.lat != null && request.lng != null
                    ? `${request.lat}, ${request.lng}`
                    : undefined
                }
              />
              <DetailRow
                label="Created"
                value={
                  request.created_at
                    ? new Date(request.created_at).toLocaleString(undefined, {
                        dateStyle: 'full',
                        timeStyle: 'short',
                      })
                    : undefined
                }
              />
            </Stack>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, pt: 1 }}>
              Customer
            </Typography>
            <Stack spacing={1.5}>
              <DetailRow label="Name" value={request.customer_name} />
              <DetailRow label="Phone" value={request.customer_phone} />
            </Stack>

            <Typography variant="subtitle2" sx={{ fontWeight: 700, pt: 1 }}>
              Technician
            </Typography>
            <Stack spacing={1.5}>
              <DetailRow label="Name" value={request.technician_name ?? undefined} />
              <DetailRow label="Phone" value={request.technician_phone ?? undefined} />
            </Stack>

            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: '0.04em' }}>
                Services
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                {request.services?.length ? request.services.join(', ') : '—'}
              </Typography>
            </Box>

            <Stack spacing={1.5}>
              <DetailRow
                label="Customer rating"
                value={request.customer_rating != null ? String(request.customer_rating) : undefined}
              />
              <DetailRow label="Technician report" value={request.technician_report} multiline />
              <DetailRow label="Latest reject reason" value={request.latest_reject_reason} multiline />
              <DetailRow label="Rejected at" value={request.latest_rejected_at} />
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained" disableElevation sx={{ px: 3 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
