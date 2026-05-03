import { Toaster } from 'react-hot-toast'

/** Global toast host — styling aligned with app theme. */
export function AppToaster() {
  return (
    <Toaster
      position="bottom-center"
      containerStyle={{ bottom: 20 }}
      toastOptions={{
        duration: 4500,
        style: {
          borderRadius: 14,
          fontWeight: 600,
          fontSize: 15,
          padding: '12px 16px',
          boxShadow: '0 10px 28px rgba(15, 23, 42, 0.12)',
        },
        success: {
          iconTheme: { primary: '#059669', secondary: '#ffffff' },
        },
        error: {
          iconTheme: { primary: '#dc2626', secondary: '#ffffff' },
        },
      }}
    />
  )
}
