import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { useMemo, useState } from 'react'
import { PageHeader } from '../components/dashboard/PageHeader'
import { QueryErrorAlert } from '../components/dashboard/QueryErrorAlert'
import { RatingsTable } from '../components/ratings/RatingsTable'
import { useAdminRatings } from '../hooks/useAdminRatings'
import { useQueryErrorToast } from '../hooks/useQueryErrorToast'
import { getErrorMessage } from '../utils/errorMessage'
import { toastError, toastSuccess, TOAST_IDS } from '../utils/toast'

export function RatingsPage() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const params = useMemo(
    () => ({
      page: page + 1,
      limit: rowsPerPage,
    }),
    [page, rowsPerPage],
  )

  const ratingsQuery = useAdminRatings(params)
  const rows = ratingsQuery.data?.results ?? []
  const total = ratingsQuery.data?.total ?? 0

  useQueryErrorToast(ratingsQuery.isError, ratingsQuery.error, TOAST_IDS.ratingsListError)

  const handleRowsPerPageChange = (n: number) => {
    setRowsPerPage(n)
    setPage(0)
  }

  const handleRetryList = async () => {
    const result = await ratingsQuery.refetch()
    if (result.isError) {
      toastError(getErrorMessage(result.error))
    } else {
      toastSuccess('Ratings updated')
    }
  }

  return (
    <Stack spacing={{ xs: 2.5, md: 3 }}>
      <PageHeader
        eyebrow="Operations"
        title="Ratings"
        description="Customer ratings after completed jobs — request, stars, participants, and timestamps."
      />

      {ratingsQuery.isError ? (
        <QueryErrorAlert
          error={ratingsQuery.error}
          title="Could not load ratings"
          onRetry={handleRetryList}
        />
      ) : null}

      <Card sx={{ overflow: 'hidden' }}>
        <Box
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: 2,
            borderBottom: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}`,
            bgcolor: alpha('#f8fafc', 0.65),
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Platform ratings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {ratingsQuery.isPending
              ? 'Loading ratings…'
              : `${total.toLocaleString()} rating${total === 1 ? '' : 's'} total`}
          </Typography>
        </Box>

        <RatingsTable
          rows={rows}
          isLoading={ratingsQuery.isPending}
          loadError={ratingsQuery.isError}
          page={page}
          rowsPerPage={rowsPerPage}
          total={total}
          onPageChange={setPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Card>
    </Stack>
  )
}
