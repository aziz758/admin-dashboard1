import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { alpha, useTheme } from '@mui/material/styles'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../constants/navigation'
import { sidebarBg } from '../theme/appTheme'

export function AppSidebar() {
  const theme = useTheme()
  const { pathname } = useLocation()

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: sidebarBg,
        color: alpha('#ffffff', 0.92),
        backgroundImage: `linear-gradient(180deg, ${alpha('#ffffff', 0.04)} 0%, transparent 42%)`,
      }}
    >
      <Toolbar sx={{ px: 2.5, minHeight: { xs: 68, sm: 72 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            aria-hidden
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              fontSize: 15,
              fontWeight: 800,
              color: '#fff',
              background: `linear-gradient(145deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
              boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.45)}`,
            }}
          >
            A
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ color: alpha('#fff', 0.55), letterSpacing: '0.08em', fontSize: 10 }}>
              CONSOLE
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
              Admin Panel
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <Box sx={{ px: 1.5, pt: 1, pb: 2, flex: 1 }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            py: 1,
            display: 'block',
            color: alpha('#fff', 0.38),
            fontWeight: 600,
            letterSpacing: '0.12em',
          }}
        >
          MENU
        </Typography>
        <List disablePadding aria-label="Main navigation">
          {NAV_ITEMS.map(({ label, path, Icon }) => {
            const selected = pathname === path
            return (
              <ListItemButton
                key={path}
                component={RouterLink}
                to={path}
                selected={selected}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.1,
                  px: 1.5,
                  color: alpha('#fff', 0.72),
                  transition: 'background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease',
                  '&:hover': {
                    bgcolor: alpha('#ffffff', 0.06),
                    color: '#fff',
                  },
                  '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.28),
                    color: '#fff',
                    boxShadow: `inset 3px 0 0 0 ${theme.palette.primary.light}`,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.34),
                    },
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.light,
                    },
                  },
                  '& .MuiListItemIcon-root': {
                    color: alpha('#fff', 0.45),
                    minWidth: 40,
                  },
                }}
              >
                <ListItemIcon>
                  <Icon sx={{ fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  slotProps={{
                    primary: { sx: { fontWeight: 600, fontSize: '0.9375rem' } },
                  }}
                />
              </ListItemButton>
            )
          })}
        </List>
      </Box>

      <Box sx={{ px: 2.5, py: 2, borderTop: `1px solid ${alpha('#fff', 0.08)}` }}>
        <Typography variant="caption" sx={{ color: alpha('#fff', 0.38) }}>
          v1.0 · Internal use
        </Typography>
      </Box>
    </Box>
  )
}
