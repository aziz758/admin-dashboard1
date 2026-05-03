import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../constants/navigation'

interface AppNavbarProps {
  titleFallback?: string
  onMenuClick: () => void
}

export function AppNavbar({
  titleFallback = 'Dashboard',
  onMenuClick,
}: AppNavbarProps) {
  const { pathname } = useLocation()

  const title = useMemo(() => {
    const match = NAV_ITEMS.find((item) => item.path === pathname)
    return match?.label ?? titleFallback
  }, [pathname, titleFallback])

  return (
    <Toolbar
      sx={{
        minHeight: { xs: 64, sm: 68 },
        px: { xs: 1.5, sm: 2.5 },
        gap: { xs: 1, sm: 2 },
      }}
    >
      <IconButton
        color="inherit"
        edge="start"
        aria-label="open navigation menu"
        onClick={onMenuClick}
        sx={{
          display: { md: 'none' },
          color: 'text.secondary',
        }}
      >
        <MenuRoundedIcon />
      </IconButton>

      <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
          You are viewing
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          noWrap
          sx={{ lineHeight: 1.25, fontWeight: 700 }}
        >
          {title}
        </Typography>
      </Box>

      <TextField
        size="small"
        placeholder="Search orders, users, requests…"
        aria-label="Search"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 22 }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          flex: 1,
          maxWidth: { sm: 420, md: 480 },
          ml: { xs: 0, sm: 'auto' },
          '& .MuiOutlinedInput-root': {
            bgcolor: alpha('#f8fafc', 0.95),
          },
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
        <Tooltip title="Notifications">
          <IconButton color="inherit" aria-label="notifications" sx={{ color: 'text.secondary' }}>
            <Badge color="error" variant="dot" overlap="circular">
              <NotificationsNoneRoundedIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title="Account">
          <IconButton size="small" aria-label="account menu" sx={{ p: 0.5 }}>
            <Avatar
              sx={{
                width: 38,
                height: 38,
                fontSize: 14,
                fontWeight: 700,
                bgcolor: 'primary.main',
                border: `2px solid ${alpha('#4f46e5', 0.2)}`,
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.28)',
              }}
            >
              AD
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
    </Toolbar>
  )
}
