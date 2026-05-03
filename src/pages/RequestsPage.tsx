import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import { useState } from 'react'
import { PageHeader } from '../components/dashboard/PageHeader'
import { QueryErrorAlert } from '../components/dashboard/QueryErrorAlert'
import { RequestDetailsModal } from '../components/requests/RequestDetailsModal'
import { RequestsFilters } from '../components/requests/RequestsFilters'
import { RequestsTable } from '../components/requests/RequestsTable'
import { useAdminRequests } from '../hooks/useAdminRequests'
import { usePaginatedFilters } from '../hooks/usePaginatedFilters'
import { useQueryErrorToast } from '../hooks/useQueryErrorToast'
import type { AdminRequest, RequestStatus } from '../types/requests.api'
import { getErrorMessage } from '../utils/errorMessage'
import { toastError, toastSuccess, TOAST_IDS } from '../utils/toast'

export function RequestsPage() {
  const { page, setPage, rowsPerPage, handleRowsPerPageChange, status, setStatus, params } =
    usePaginatedFilters<RequestStatus>()

  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<AdminRequest | null>(null)

  const requestsQuery = useAdminRequests(params)

  const rows = requestsQuery.data?.results ?? []
  const total = requestsQuery.data?.total ?? 0

  useQueryErrorToast(requestsQuery.isError, requestsQuery.error, TOAST_IDS.requestsListError)

  const openView = (row: AdminRequest) => {
    setSelected(row)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelected(null)
  }

  const handleRetryList = async () => {
    const result = await requestsQuery.refetch()
    if (result.isError) {
      toastError(getErrorMessage(result.error))
    } else {
      toastSuccess('Requests updated')
    }
  }

  return (
    <Stack spacing={{ xs: 2.5, md: 3 }}>
      <PageHeader
        eyebrow="Operations"
        title="Requests"
        description="Browse service requests, filter by lifecycle status, and open any row for full details."
      />

      {requestsQuery.isError ? (
        <QueryErrorAlert
          error={requestsQuery.error}
          title="Could not load requests"
          onRetry={handleRetryList}
        />
      ) : null}

      <Card sx={{ overflow: 'hidden' }}>
        <RequestsFilters
          status={status}
          onStatusChange={setStatus}
          total={total}
          isLoading={requestsQuery.isPending}
        />
        <RequestsTable
          rows={rows}
          isLoading={requestsQuery.isPending}
          loadError={requestsQuery.isError}
          page={page}
          rowsPerPage={rowsPerPage}
          total={total}
          onPageChange={setPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          onView={openView}
        />
      </Card>

      <RequestDetailsModal open={modalOpen} request={selected} onClose={closeModal} />
    </Stack>
  )
}
