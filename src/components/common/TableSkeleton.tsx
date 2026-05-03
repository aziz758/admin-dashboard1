import Skeleton from '@mui/material/Skeleton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

interface TableSkeletonProps {
  /** Number of columns in the table. */
  columns: number
  /** Number of skeleton rows to render. Defaults to 6. */
  rows?: number
}

/** Renders placeholder skeleton rows for a MUI Table loading state. */
export function TableSkeleton({ columns, rows = 6 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: columns }).map((__, j) => (
            <TableCell key={j}>
              <Skeleton variant="text" height={j === 0 ? 24 : 20} width={j === 0 ? '70%' : '90%'} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}
