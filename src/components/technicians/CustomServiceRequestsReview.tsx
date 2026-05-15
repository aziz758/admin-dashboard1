import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import { alpha } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { queryKeys } from '../../constants/queryKeys'
import { useCustomServiceRequestMutations } from '../../hooks/useCustomServiceRequestMutations'
import { getServicesCatalog } from '../../services/adminService'
import type { TechnicianCustomServiceRequest } from '../../types/technicians.api'
import type { ServiceCatalogItem } from '../../types/services.api'
import type { ApproveCustomServiceBody } from '../../types/customServiceRequests.api'
import { getErrorMessage } from '../../utils/errorMessage'
import { toastError, toastSuccess } from '../../utils/toast'

function isPendingCustomStatus(status: string): boolean {
  return status.trim().toLowerCase() === 'pending'
}

interface PendingCustomServiceRequestRowProps {
  request: TechnicianCustomServiceRequest
  services: ServiceCatalogItem[]
  busyApproveRequestId: number | null
  busyRejectRequestId: number | null
  onApprove: (vars: { requestId: number; body: ApproveCustomServiceBody }) => void
  onReject: (vars: { requestId: number; admin_note: string }) => void
}

function PendingCustomServiceRequestRow({
  request,
  services,
  busyApproveRequestId,
  busyRejectRequestId,
  onApprove,
  onReject,
}: PendingCustomServiceRequestRowProps) {
  const [approveMode, setApproveMode] = useState<'link' | 'new'>('link')
  const [serviceId, setServiceId] = useState<string>('')
  const [serviceName, setServiceName] = useState('')
  const [adminNoteApprove, setAdminNoteApprove] = useState('')
  const [adminNoteReject, setAdminNoteReject] = useState('')

  const busyApprove = busyApproveRequestId === request.id
  const busyReject = busyRejectRequestId === request.id
  const busy = busyApprove || busyReject

  const handleApprove = () => {
    const note = adminNoteApprove.trim()
    const admin_note = note ? note : undefined

    if (approveMode === 'link') {
      const id = Number(serviceId)
      if (!Number.isFinite(id) || id <= 0) {
        toastError('Select an existing service to link.')
        return
      }
      const body: ApproveCustomServiceBody = admin_note
        ? { service_id: id, admin_note }
        : { service_id: id }
      onApprove({ requestId: request.id, body })
      return
    }

    const name = serviceName.trim()
    if (!name) {
      toastError('Enter the official service name to create.')
      return
    }
    const body: ApproveCustomServiceBody = admin_note
      ? { service_name: name, admin_note }
      : { service_name: name }
    onApprove({ requestId: request.id, body })
  }

  const handleReject = () => {
    const note = adminNoteReject.trim()
    if (!note) {
      toastError('Enter an admin note for rejection.')
      return
    }
    onReject({ requestId: request.id, admin_note: note })
  }

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}`,
        bgcolor: alpha('#fffbeb', 0.5),
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {request.requested_name}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        Request #{request.id}
        {request.created_at ? ` · ${request.created_at}` : ''}
      </Typography>

      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        Approve
      </Typography>
      <FormControl component="fieldset" variant="standard" sx={{ mb: 1.5 }}>
        <FormLabel component="legend" sx={{ fontSize: 13, fontWeight: 600 }}>
          Match strategy
        </FormLabel>
        <RadioGroup
          row
          value={approveMode}
          onChange={(e) => setApproveMode(e.target.value as 'link' | 'new')}
        >
          <FormControlLabel value="link" control={<Radio size="small" disabled={busy} />} label="Link existing service" />
          <FormControlLabel value="new" control={<Radio size="small" disabled={busy} />} label="New official name" />
        </RadioGroup>
      </FormControl>

      {approveMode === 'link' ? (
        <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
          <InputLabel id={`svc-${request.id}`}>Service</InputLabel>
          <Select
            labelId={`svc-${request.id}`}
            label="Service"
            value={serviceId}
            onChange={(e) => setServiceId(String(e.target.value))}
            disabled={busy}
          >
            <MenuItem value="">
              <em>Select…</em>
            </MenuItem>
            {services.map((s) => (
              <MenuItem key={s.id} value={String(s.id)}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <TextField
          fullWidth
          size="small"
          label="Official service name"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          disabled={busy}
          sx={{ mb: 1.5 }}
        />
      )}

      <TextField
        fullWidth
        size="small"
        label="Admin note (optional)"
        value={adminNoteApprove}
        onChange={(e) => setAdminNoteApprove(e.target.value)}
        disabled={busy}
        sx={{ mb: 1.5 }}
      />

      <Button
        variant="contained"
        color="success"
        size="small"
        disableElevation
        disabled={busy}
        onClick={handleApprove}
        startIcon={busyApprove ? <CircularProgress color="inherit" size={14} /> : undefined}
      >
        Approve request
      </Button>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        Reject
      </Typography>
      <TextField
        fullWidth
        size="small"
        label="Admin note (required)"
        value={adminNoteReject}
        onChange={(e) => setAdminNoteReject(e.target.value)}
        disabled={busy}
        multiline
        minRows={2}
        sx={{ mb: 1.5 }}
      />
      <Button
        variant="outlined"
        color="error"
        size="small"
        disabled={busy}
        onClick={handleReject}
        startIcon={busyReject ? <CircularProgress color="inherit" size={14} /> : undefined}
      >
        Reject request
      </Button>
    </Box>
  )
}

interface CustomServiceRequestsReviewProps {
  technicianId: number
  requests: TechnicianCustomServiceRequest[]
}

export function CustomServiceRequestsReview({ technicianId, requests }: CustomServiceRequestsReviewProps) {
  const { approve, reject } = useCustomServiceRequestMutations(technicianId)

  const servicesQuery = useQuery({
    queryKey: queryKeys.services.catalog,
    queryFn: getServicesCatalog,
    staleTime: 10 * 60_000,
  })

  const services = servicesQuery.data ?? []

  const busyApproveId =
    approve.isPending && approve.variables ? approve.variables.requestId : null
  const busyRejectId = reject.isPending && reject.variables ? reject.variables.requestId : null

  const handleApprove = (vars: { requestId: number; body: ApproveCustomServiceBody }) => {
    approve.mutate(vars, {
      onSuccess: () => toastSuccess('Custom service request approved'),
      onError: (err) => toastError(getErrorMessage(err)),
    })
  }

  const handleReject = (vars: { requestId: number; admin_note: string }) => {
    reject.mutate(vars, {
      onSuccess: () => toastSuccess('Custom service request rejected'),
      onError: (err) => toastError(getErrorMessage(err)),
    })
  }

  if (!requests.length) return null

  const pending = requests.filter((r) => isPendingCustomStatus(r.status))
  const completed = requests.filter((r) => !isPendingCustomStatus(r.status))

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        Custom service requests
      </Typography>

      {servicesQuery.isError ? (
        <Alert severity="error" sx={{ mb: 1.5, borderRadius: 2 }}>
          Could not load service catalog. Approve-by-link needs the list. {getErrorMessage(servicesQuery.error)}
        </Alert>
      ) : null}

      {servicesQuery.isPending ? (
        <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 1, mb: 2 }}>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            Loading services…
          </Typography>
        </Stack>
      ) : null}

      {pending.length ? (
        <Stack spacing={2} sx={{ mb: completed.length ? 2 : 0 }}>
          {pending.map((req) => (
            <PendingCustomServiceRequestRow
              key={req.id}
              request={req}
              services={services}
              busyApproveRequestId={busyApproveId}
              busyRejectRequestId={busyRejectId}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </Stack>
      ) : null}

      {completed.length ? (
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Reviewed
          </Typography>
          {completed.map((req) => (
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
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Status: {req.status}
                {req.approved_service_name ? ` · ${req.approved_service_name}` : ''}
                {req.reviewed_at ? ` · ${req.reviewed_at}` : ''}
              </Typography>
            </Box>
          ))}
        </Stack>
      ) : null}
    </Box>
  )
}
