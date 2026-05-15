import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { useMutation } from '@tanstack/react-query'
import { type FormEvent, useState } from 'react'
import { broadcastAdminNotification } from '../../services/adminService'
import type { BroadcastTarget } from '../../types/notifications.api'
import { getErrorMessage } from '../../utils/errorMessage'
import { toastError, toastSuccess } from '../../utils/toast'

function parseUserIds(raw: string): number[] {
  const ids = new Set<number>()
  for (const part of raw.split(/[\s,;]+/)) {
    const s = part.trim()
    if (!s) continue
    const n = Number.parseInt(s, 10)
    if (Number.isFinite(n) && n > 0) ids.add(n)
  }
  return [...ids]
}

const TARGET_OPTIONS: { value: BroadcastTarget; label: string; description: string }[] = [
  { value: 'all', label: 'Everyone', description: 'All registered users' },
  { value: 'customers', label: 'Customers only', description: 'Customer accounts' },
  { value: 'technicians', label: 'Technicians only', description: 'Technician accounts' },
  { value: 'specific', label: 'Specific user IDs', description: 'Paste or type numeric IDs' },
]

export function AdminBroadcastForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [target, setTarget] = useState<BroadcastTarget>('all')
  const [userIdsRaw, setUserIdsRaw] = useState('')

  const mutation = useMutation({
    mutationFn: broadcastAdminNotification,
    onSuccess: () => {
      toastSuccess('Broadcast queued successfully')
      setTitle('')
      setBody('')
      setTarget('all')
      setUserIdsRaw('')
    },
    onError: (err) => {
      toastError(getErrorMessage(err))
    },
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const t = title.trim()
    const b = body.trim()
    if (!t) {
      toastError('Title is required.')
      return
    }
    if (!b) {
      toastError('Message body is required.')
      return
    }

    const user_ids = target === 'specific' ? parseUserIds(userIdsRaw) : []
    if (target === 'specific' && user_ids.length === 0) {
      toastError('When targeting specific users, add at least one numeric user ID.')
      return
    }

    mutation.mutate({ title: t, body: b, target, user_ids })
  }

  return (
    <Card
      sx={{
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}`,
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(15, 23, 42, 0.06)',
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          Push broadcast
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Sends a platform notification according to backend rules (FCM / in-app). Delivery depends on user
          devices and tokens.
        </Typography>

        <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2 }}>
          Use <strong>Specific user IDs</strong> only when you have internal numeric IDs from the users
          directory. Separate IDs with commas, spaces, or new lines.
        </Alert>

        <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            disabled={mutation.isPending}
            slotProps={{ input: { sx: { borderRadius: 2 } } }}
          />

          <TextField
            label="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            fullWidth
            multiline
            minRows={4}
            disabled={mutation.isPending}
            slotProps={{ input: { sx: { borderRadius: 2 } } }}
          />

          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
              Audience
            </FormLabel>
            <RadioGroup
              value={target}
              onChange={(e) => setTarget(e.target.value as BroadcastTarget)}
            >
              {TARGET_OPTIONS.map((opt) => (
                <FormControlLabel
                  key={opt.value}
                  value={opt.value}
                  control={<Radio size="small" disabled={mutation.isPending} />}
                  disabled={mutation.isPending}
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {opt.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {opt.description}
                      </Typography>
                    </Box>
                  }
                  sx={{ alignItems: 'flex-start', mb: 0.5 }}
                />
              ))}
            </RadioGroup>
          </FormControl>

          {target === 'specific' ? (
            <TextField
              label="User IDs"
              value={userIdsRaw}
              onChange={(e) => setUserIdsRaw(e.target.value)}
              fullWidth
              multiline
              minRows={3}
              placeholder={'e.g. 12, 34, 56'}
              disabled={mutation.isPending}
              helperText={`Parsed: ${parseUserIds(userIdsRaw).length} unique ID(s)`}
              slotProps={{ input: { sx: { borderRadius: 2 } } }}
            />
          ) : null}

          <Box>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disableElevation
              disabled={mutation.isPending}
              sx={{ px: 3, py: 1.25, fontWeight: 700 }}
              startIcon={mutation.isPending ? <CircularProgress size={20} color="inherit" /> : undefined}
            >
              {mutation.isPending ? 'Sending…' : 'Send broadcast'}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
