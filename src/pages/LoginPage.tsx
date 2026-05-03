import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { type FormEvent, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { markSessionActive, setAccessToken } from '../utils/authStorage'
import { getErrorMessage } from '../utils/errorMessage'
import { toastError } from '../utils/toast'
import { api } from '../services/api'
import { ROUTES } from '../routes/paths'

interface LocationState {
  from?: { pathname: string }
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState)?.from?.pathname ?? ROUTES.dashboard
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post<{ access_token: string }>('/auth/login', {
        email,
        password,
      })
      setAccessToken(data.access_token)
      markSessionActive()
      navigate(from, { replace: true })
    } catch (err) {
      toastError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'background.default',
        backgroundImage: `radial-gradient(${alpha('#4f46e5', 0.06)} 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        p: 2,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}`,
          boxShadow: '0 8px 32px rgba(15, 23, 42, 0.08)',
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              aria-hidden
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                display: 'grid',
                placeItems: 'center',
                fontSize: 18,
                fontWeight: 800,
                color: '#fff',
                background: (theme) =>
                  `linear-gradient(145deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
                boxShadow: (theme) =>
                  `0 8px 20px ${alpha(theme.palette.primary.main, 0.45)}`,
                mx: 'auto',
                mb: 2,
              }}
            >
              A
            </Box>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
              Admin Panel
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Sign in to your account
            </Typography>
          </Box>

          <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
            <TextField
              id="login-email"
              label="Phone Number"
              type="phone"
              autoComplete="phone"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              id="login-password"
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disableElevation
              disabled={loading}
              sx={{ py: 1.25, fontWeight: 700 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign in'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
