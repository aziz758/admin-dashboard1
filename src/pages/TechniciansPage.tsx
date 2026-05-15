import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import { useState } from 'react'
import { PageHeader } from '../components/dashboard/PageHeader'
import { QueryErrorAlert } from '../components/dashboard/QueryErrorAlert'
import { TechnicianDetailsModal } from '../components/technicians/TechnicianDetailsModal'
import { TechniciansFilters } from '../components/technicians/TechniciansFilters'
import { TechniciansTable } from '../components/technicians/TechniciansTable'
import { usePaginatedFilters } from '../hooks/usePaginatedFilters'
import { useTechnicianDetail } from '../hooks/useTechnicianDetail'
import { useApproveTechnician, useRejectTechnician } from '../hooks/useTechnicianMutations'
import { useQueryErrorToast } from '../hooks/useQueryErrorToast'
import { useTechnicians } from '../hooks/useTechnicians'
import type { Technician, TechnicianStatus } from '../types/technicians.api'
import { getErrorMessage } from '../utils/errorMessage'
import { toastError, toastSuccess, TOAST_IDS } from '../utils/toast'

export function TechniciansPage() {
  const { page, setPage, rowsPerPage, handleRowsPerPageChange, status, setStatus, params } =
    usePaginatedFilters<TechnicianStatus>()

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null)
  const [startRejectFlow, setStartRejectFlow] = useState(false)

  const techniciansQuery = useTechnicians(params)
  const detailQuery = useTechnicianDetail(
    selectedTechnician?.id ?? null,
    Boolean(modalOpen && selectedTechnician),
  )
  const technicianForModal = detailQuery.data ?? selectedTechnician

  const approveMutation = useApproveTechnician()
  const rejectMutation = useRejectTechnician()

  const rows = techniciansQuery.data?.results ?? []
  const total = techniciansQuery.data?.total ?? 0

  useQueryErrorToast(techniciansQuery.isError, techniciansQuery.error, TOAST_IDS.techniciansListError)

  const busyApproveId =
    approveMutation.isPending && approveMutation.variables !== undefined
      ? approveMutation.variables
      : null
  const busyRejectId =
    rejectMutation.isPending && rejectMutation.variables
      ? rejectMutation.variables.id
      : null

  const modalApproving =
    Boolean(technicianForModal) &&
    approveMutation.isPending &&
    approveMutation.variables === technicianForModal?.id

  const modalRejecting =
    Boolean(technicianForModal) &&
    rejectMutation.isPending &&
    rejectMutation.variables?.id === technicianForModal?.id

  const closeModal = () => {
    setModalOpen(false)
    setSelectedTechnician(null)
    setStartRejectFlow(false)
  }

  const openView = (t: Technician) => {
    setSelectedTechnician(t)
    setStartRejectFlow(false)
    setModalOpen(true)
  }

  const openReject = (t: Technician) => {
    setSelectedTechnician(t)
    setStartRejectFlow(true)
    setModalOpen(true)
  }

  const handleApprove = (id: Technician['id']) => {
    approveMutation.mutate(id, {
      onSuccess: () => {
        toastSuccess('Technician approved')
        closeModal()
      },
      onError: (err) => {
        toastError(getErrorMessage(err))
      },
    })
  }

  const handleApproveRow = (t: Technician) => {
    approveMutation.mutate(t.id, {
      onSuccess: () => toastSuccess('Technician approved'),
      onError: (err) => toastError(getErrorMessage(err)),
    })
  }

  const handleReject = (id: Technician['id'], reason?: string | null) => {
    rejectMutation.mutate(
      { id, reason },
      {
        onSuccess: () => {
          toastSuccess('Technician rejected')
          closeModal()
        },
        onError: (err) => {
          toastError(getErrorMessage(err))
        },
      },
    )
  }

  const handleRetryList = async () => {
    const result = await techniciansQuery.refetch()
    if (result.isError) {
      toastError(getErrorMessage(result.error))
    } else {
      toastSuccess('Technicians list updated')
    }
  }

  return (
    <Stack spacing={{ xs: 2.5, md: 3 }}>
      <PageHeader
        eyebrow="Operations"
        title="Technicians"
        description="Review onboarding requests, approve credentials, and keep your workforce data organized."
      />

      {techniciansQuery.isError ? (
        <QueryErrorAlert
          error={techniciansQuery.error}
          title="Could not load technicians"
          onRetry={handleRetryList}
        />
      ) : null}

      <Card sx={{ overflow: 'hidden' }}>
        <TechniciansFilters
          status={status}
          onStatusChange={setStatus}
          total={total}
          isLoading={techniciansQuery.isPending}
        />
        <TechniciansTable
          rows={rows}
          isLoading={techniciansQuery.isPending}
          loadError={techniciansQuery.isError}
          page={page}
          rowsPerPage={rowsPerPage}
          total={total}
          onPageChange={setPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          onView={openView}
          onApprove={handleApproveRow}
          onReject={openReject}
          busyApproveId={busyApproveId}
          busyRejectId={busyRejectId}
        />
      </Card>

      <TechnicianDetailsModal
        open={modalOpen}
        technician={technicianForModal}
        isDetailFetching={detailQuery.isFetching}
        onClose={closeModal}
        onApprove={handleApprove}
        onReject={handleReject}
        isApproving={modalApproving}
        isRejecting={modalRejecting}
        startWithReject={startRejectFlow}
      />
    </Stack>
  )
}
