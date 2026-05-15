import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { useEffect, useMemo, useRef, useState } from 'react'
import { PageHeader } from '../components/dashboard/PageHeader'
import { QueryErrorAlert } from '../components/dashboard/QueryErrorAlert'
import { UsersFilters, type UsersFilterType } from '../components/users/UsersFilters'
import { UsersTable } from '../components/users/UsersTable'
import { useAdminUsers } from '../hooks/useAdminUsers'
import { useDeleteAdminUser } from '../hooks/useDeleteAdminUser'
import { useQueryErrorToast } from '../hooks/useQueryErrorToast'
import type { AdminUserRow } from '../types/users.api'
import { getErrorMessage } from '../utils/errorMessage'
import { toastError, toastSuccess, TOAST_IDS } from '../utils/toast'

export function UsersPage() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [userType, setUserType] = useState<UsersFilterType>('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')

  const [confirmDelete, setConfirmDelete] = useState<AdminUserRow | null>(null)
  const lastCommittedSearchRef = useRef('')

  useEffect(() => {
    const t = window.setTimeout(() => {
      const next = searchInput.trim()
      setSearch(next)
      if (lastCommittedSearchRef.current !== next) {
        lastCommittedSearchRef.current = next
        window.setTimeout(() => {
          setPage(0)
        }, 0)
      }
    }, 400)
    return () => window.clearTimeout(t)
  }, [searchInput])

  const params = useMemo(
    () => ({
      page: page + 1,
      limit: rowsPerPage,
      ...(userType ? { user_type: userType } : {}),
      ...(search ? { search } : {}),
    }),
    [page, rowsPerPage, userType, search],
  )

  const usersQuery = useAdminUsers(params)
  const deleteMutation = useDeleteAdminUser()

  const rows = usersQuery.data?.results ?? []
  const total = usersQuery.data?.total ?? 0

  useQueryErrorToast(usersQuery.isError, usersQuery.error, TOAST_IDS.usersListError)

  const busyDeleteKey =
    deleteMutation.isPending && deleteMutation.variables
      ? `${deleteMutation.variables.user_type}-${deleteMutation.variables.id}`
      : null

  const handleRowsPerPageChange = (n: number) => {
    setRowsPerPage(n)
    setPage(0)
  }

  const handleRetryList = async () => {
    const result = await usersQuery.refetch()
    if (result.isError) {
      toastError(getErrorMessage(result.error))
    } else {
      toastSuccess('Users updated')
    }
  }

  const handleConfirmDelete = () => {
    if (!confirmDelete) return
    deleteMutation.mutate(
      { id: confirmDelete.id, user_type: confirmDelete.user_type },
      {
        onSuccess: () => {
          toastSuccess('User deleted')
          setConfirmDelete(null)
        },
        onError: (err) => {
          toastError(getErrorMessage(err))
        },
      },
    )
  }

  return (
    <Stack spacing={{ xs: 2.5, md: 3 }}>
      <PageHeader
        eyebrow="Operations"
        title="Users"
        description="Browse customers and technicians, search by name or phone, and soft-delete accounts when needed."
      />

      {usersQuery.isError ? (
        <QueryErrorAlert
          error={usersQuery.error}
          title="Could not load users"
          onRetry={handleRetryList}
        />
      ) : null}

      <Card sx={{ overflow: 'hidden' }}>
        <UsersFilters
          userType={userType}
          onUserTypeChange={(v) => {
            setUserType(v)
            setPage(0)
          }}
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          total={total}
          isLoading={usersQuery.isPending}
        />
        <UsersTable
          rows={rows}
          isLoading={usersQuery.isPending}
          loadError={usersQuery.isError}
          page={page}
          rowsPerPage={rowsPerPage}
          total={total}
          onPageChange={setPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          onRequestDelete={setConfirmDelete}
          busyDeleteKey={busyDeleteKey}
        />
      </Card>

      <Dialog
        open={Boolean(confirmDelete)}
        onClose={() => {
          if (!deleteMutation.isPending) setConfirmDelete(null)
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}`,
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete user?</DialogTitle>
        <DialogContent>
          {confirmDelete ? (
            <Typography variant="body2" color="text.secondary">
              This will soft-delete{' '}
              <strong>{confirmDelete.name}</strong> ({confirmDelete.phone}) as{' '}
              <strong>{confirmDelete.user_type}</strong>. Technicians may be set offline. This action may be
              irreversible depending on backend policy.
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setConfirmDelete(null)} color="inherit" disabled={deleteMutation.isPending}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disableElevation
            disabled={deleteMutation.isPending}
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
