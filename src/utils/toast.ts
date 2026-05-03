import toast from 'react-hot-toast'

export const TOAST_IDS = {
  adminStatisticsError: 'admin-statistics-error',
  adminDashboardError: 'admin-dashboard-error',
  techniciansListError: 'technicians-list-error',
  requestsListError: 'requests-list-error',
} as const

export function toastSuccess(message: string) {
  return toast.success(message)
}

export function toastError(message: string, options?: Parameters<typeof toast.error>[1]) {
  return toast.error(message, options)
}

export function toastLoading(message: string) {
  return toast.loading(message)
}

export function dismissToast(toastId: string) {
  toast.dismiss(toastId)
}
