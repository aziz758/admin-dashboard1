import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <Stack
      spacing={2}
      sx={{
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'flex-end' },
        justifyContent: 'space-between',
        mb: 0.5,
      }}
    >
      <Box>
        {eyebrow ? (
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: '0.14em',
              display: 'block',
              mb: 0.5,
            }}
          >
            {eyebrow}
          </Typography>
        ) : null}
        <Typography variant="h4" component="h1" sx={{ letterSpacing: '-0.02em' }}>
          {title}
        </Typography>
        {description ? (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 1, maxWidth: 640, lineHeight: 1.65 }}
          >
            {description}
          </Typography>
        ) : null}
      </Box>
      {action ? (
        <Box
          sx={{
            width: { xs: '100%', sm: 'auto' },
            display: 'flex',
            justifyContent: { xs: 'stretch', sm: 'flex-end' },
            alignSelf: { xs: 'stretch', sm: 'flex-end' },
          }}
        >
          {action}
        </Box>
      ) : null}
    </Stack>
  )
}
