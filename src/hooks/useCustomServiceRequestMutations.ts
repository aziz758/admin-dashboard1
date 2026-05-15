import type { QueryClient } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../constants/queryKeys'
import {
  approveCustomServiceRequest,
  rejectCustomServiceRequest,
} from '../services/adminService'
import type { ApproveCustomServiceBody } from '../types/customServiceRequests.api'

async function invalidateTechnicianQueries(queryClient: QueryClient, technicianId: number) {
  await queryClient.invalidateQueries({ queryKey: queryKeys.admin.technicians.all })
  await queryClient.invalidateQueries({ queryKey: queryKeys.admin.technicians.detail(technicianId) })
}

export function useCustomServiceRequestMutations(technicianId: number) {
  const queryClient = useQueryClient()

  const approve = useMutation({
    mutationFn: ({ requestId, body }: { requestId: number; body: ApproveCustomServiceBody }) =>
      approveCustomServiceRequest(requestId, body),
    onSuccess: async () => {
      await invalidateTechnicianQueries(queryClient, technicianId)
    },
  })

  const reject = useMutation({
    mutationFn: ({ requestId, admin_note }: { requestId: number; admin_note: string }) =>
      rejectCustomServiceRequest(requestId, { admin_note }),
    onSuccess: async () => {
      await invalidateTechnicianQueries(queryClient, technicianId)
    },
  })

  return { approve, reject }
}
