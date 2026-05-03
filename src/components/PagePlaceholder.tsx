import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'

interface PagePlaceholderProps {
  title: string
}

export function PagePlaceholder({ title }: PagePlaceholderProps) {
  return (
    <Card
      sx={{
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}`,
        boxShadow: '0 4px 24px rgba(15, 23, 42, 0.05)',
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: '0.14em' }}>
          Coming soon
        </Typography>
        <Typography variant="h5" component="h1" sx={{ mt: 1, mb: 1.5, fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 520 }}>
          This module will host your tables, filters, and workflows. Wire it to your services layer when you are
          ready.
        </Typography>
        <Box
          sx={{
            py: 6,
            px: 2,
            borderRadius: 2,
            textAlign: 'center',
            bgcolor: alpha('#64748b', 0.06),
            border: `1px dashed ${alpha('#64748b', 0.25)}`,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Empty state — add content here
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
