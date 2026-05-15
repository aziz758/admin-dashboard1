import { useCallback, useMemo, useState } from 'react'

export interface PaginatedFiltersReturn<S extends string> {
  page: number
  setPage: (page: number) => void
  rowsPerPage: number
  handleRowsPerPageChange: (n: number) => void
  status: '' | S
  setStatus: (status: '' | S) => void
  /** API-ready params object (1-indexed page). */
  params: {
    page: number
    limit: number
    status?: S
  }
}

/**
 * Encapsulates the common page + rowsPerPage + status filter state
 * used by paginated list pages (TechniciansPage, RequestsPage, etc.).
 *
 * Resets to page 0 whenever `setStatus` is called (status filter change).
 *
 * @example
 * const { page, setPage, rowsPerPage, handleRowsPerPageChange, status, setStatus, params }
 *   = usePaginatedFilters<TechnicianStatus>()
 */
export function usePaginatedFilters<S extends string>(
  defaultRowsPerPage = 10,
): PaginatedFiltersReturn<S> {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage)
  const [status, setStatusState] = useState<'' | S>('' as '' | S)

  const setStatus = useCallback((value: '' | S) => {
    setStatusState(value)
    setPage(0)
  }, [])

  const params = useMemo(
    () => ({
      page: page + 1,
      limit: rowsPerPage,
      ...(status ? { status } : {}),
    }),
    [page, rowsPerPage, status],
  )

  const handleRowsPerPageChange = (n: number) => {
    setRowsPerPage(n)
    setPage(0)
  }

  return {
    page,
    setPage,
    rowsPerPage,
    handleRowsPerPageChange,
    status,
    setStatus,
    params,
  }
}
