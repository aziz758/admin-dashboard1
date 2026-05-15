import Stack from '@mui/material/Stack'
import { PageHeader } from '../components/dashboard/PageHeader'
import { AdminBroadcastForm } from '../components/notifications/AdminBroadcastForm'

export function NotificationsPage() {
  return (
    <Stack spacing={{ xs: 2.5, md: 3 }}>
      <PageHeader
        eyebrow="Operations"
        title="Notifications"
        description="Compose a title and message, choose who should receive it, and send a broadcast through the admin API."
      />

      <AdminBroadcastForm />
    </Stack>
  )
}
