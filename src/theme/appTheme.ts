import { alpha, createTheme } from '@mui/material/styles'

const ink = '#0b1220'
const surface = '#f4f6fb'

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5',
      light: '#818cf8',
      dark: '#3730a3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#64748b',
    },
    success: {
      main: '#059669',
      light: '#34d399',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    divider: alpha('#0f172a', 0.08),
    background: {
      default: surface,
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif',
    h3: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 600, letterSpacing: '0.02em' },
    body2: { lineHeight: 1.6 },
    caption: { letterSpacing: '0.02em' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${alpha('#64748b', 0.4)} transparent`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: `1px solid ${alpha('#0f172a', 0.06)}`,
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          bgcolor: alpha('#f8fafc', 0.9),
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#0f172a', 0.08),
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#0f172a', 0.14),
          },
        },
      },
    },
  },
})

export const sidebarBg = ink
