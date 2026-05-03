import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

interface DetailRowProps {
  label: string
  value: string | null | undefined
  multiline?: boolean
}

/** Displays a label + value pair used inside detail modals / panels. */
export function DetailRow({ label, value, multiline }: DetailRowProps) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: '0.04em' }}>
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mt: 0.25,
          fontWeight: 500,
          whiteSpace: multiline ? 'pre-wrap' : undefined,
        }}
      >
        {value && String(value).trim() !== '' ? value : '—'}
      </Typography>
    </Box>
  )
}
