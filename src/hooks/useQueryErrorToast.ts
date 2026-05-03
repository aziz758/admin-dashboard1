import { useEffect } from 'react'
import { getErrorMessage } from '../utils/errorMessage'
import { dismissToast, toastError } from '../utils/toast'

/**
 * Automatically shows/dismisses a toast when a React Query enters/leaves
 * the error state. Prevents duplicates by assigning a stable `toastId`.
 *
 * @example
 * const query = useAdminStatistics()
 * useQueryErrorToast(query.isError, query.error, TOAST_IDS.adminStatisticsError)
 */
export function useQueryErrorToast(
  isError: boolean,
  error: unknown,
  toastId: string,
) {
  useEffect(() => {
    if (isError) {
      toastError(getErrorMessage(error), { id: toastId })
    } else {
      dismissToast(toastId)
    }
  }, [isError, error, toastId])
}
