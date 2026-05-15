import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { useEffect, useRef, useState } from 'react'
import { getTechnicianIdCardBlob } from '../../services/adminService'

interface TechnicianIdCardPreviewProps {
  technicianId: number
  /** When false, revoke URL and stop loading */
  active: boolean
}

/**
 * Fetches protected ID card with Bearer token (`responseType: 'blob'`) and shows it.
 * @see `docs/frontend-integration.md` §7.5
 */
export function TechnicianIdCardPreview({ technicianId, active }: TechnicianIdCardPreviewProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [phase, setPhase] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const urlRef = useRef<string | null>(null)

  useEffect(() => {
    const revokeCurrent = () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current)
        urlRef.current = null
      }
      setObjectUrl(null)
    }

    if (!active) {
      revokeCurrent()
      setPhase('idle')
      setMessage(null)
      return
    }

    let cancelled = false
    setPhase('loading')
    setMessage(null)
    revokeCurrent()

    ;(async () => {
      try {
        const blob = await getTechnicianIdCardBlob(technicianId)
        if (cancelled) return
        const url = URL.createObjectURL(blob)
        if (cancelled) {
          URL.revokeObjectURL(url)
          return
        }
        urlRef.current = url
        setObjectUrl(url)
        setPhase('ready')
      } catch (e) {
        if (cancelled) return
        setPhase('error')
        setMessage(e instanceof Error ? e.message : 'Could not load ID document')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [active, technicianId])

  useEffect(() => {
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current)
        urlRef.current = null
      }
    }
  }, [])

  if (!active) return null

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: '0.04em' }}>
        ID document (protected)
      </Typography>

      {phase === 'loading' ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.5 }}>
          <CircularProgress size={22} />
          <Typography variant="body2" color="text.secondary">
            Loading…
          </Typography>
        </Box>
      ) : null}

      {phase === 'error' && message ? (
        <Alert severity="warning" sx={{ mt: 1.5, borderRadius: 2 }}>
          {message}
        </Alert>
      ) : null}

      {phase === 'ready' && objectUrl ? (
        <Box
          sx={{
            mt: 1.5,
            borderRadius: 2,
            overflow: 'hidden',
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}`,
            bgcolor: alpha('#0f172a', 0.04),
            maxHeight: 360,
          }}
        >
          <Box
            component="img"
            src={objectUrl}
            alt="Technician ID card"
            sx={{ display: 'block', width: '100%', height: 'auto', maxHeight: 360, objectFit: 'contain' }}
          />
        </Box>
      ) : null}
    </Box>
  )
}
