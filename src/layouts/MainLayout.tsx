import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { alpha } from '@mui/material/styles'
import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AppNavbar } from './AppNavbar'
import { AppSidebar } from './AppSidebar'
import { DRAWER_WIDTH } from './drawerWidth'

export function MainLayout() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleMenuClick = useCallback(() => {
    setMobileOpen(true)
  }, [])

  const handleDrawerClose = useCallback(() => {
    setMobileOpen(false)
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => {
      setMobileOpen(false)
    }, 0)
    return () => window.clearTimeout(id)
  }, [pathname])

  const drawerPaperSx = {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box' as const,
    bgcolor: 'transparent',
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
        backgroundImage: `radial-gradient(${alpha('#4f46e5', 0.06)} 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: alpha('#ffffff', 0.78),
          backdropFilter: 'blur(14px)',
          color: 'text.primary',
          borderBottom: `1px solid ${alpha('#0f172a', 0.07)}`,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          boxShadow: 'none',
        }}
      >
        <AppNavbar onMenuClick={handleMenuClick} />
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': drawerPaperSx,
          }}
        >
          <AppSidebar />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': drawerPaperSx,
          }}
          open
        >
          <AppSidebar />
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}
