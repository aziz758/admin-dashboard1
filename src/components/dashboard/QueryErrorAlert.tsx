import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { getErrorMessage } from '../../utils/errorMessage'

interface QueryErrorAlertProps {
  error: unknown
  title?: string
  onRetry?: () => void | Promise<void>
}

export function QueryErrorAlert({ error, title = 'Could not load data', onRetry }: QueryErrorAlertProps) {
  const message = getErrorMessage(error)

  return (
    <Alert
      severity="error"
      sx={{ borderRadius: 2 }}
      action={
        onRetry ? (
          <Button
            color="inherit"
            size="small"
            startIcon={<RefreshRoundedIcon />}
            onClick={() => void Promise.resolve(onRetry())}
            sx={{ fontWeight: 600 }}
          >
            Retry
          </Button>
        ) : undefined
      }
    >
      <AlertTitle sx={{ fontWeight: 700 }}>{title}</AlertTitle>
      <Typography variant="body2" component="p" sx={{ mt: 0.5 }}>
        {message}
      </Typography>
    </Alert>
  )
}
