import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../constants/queryKeys'
import { approveTechnician, rejectTechnician } from '../services/adminService'
import type { Technician } from '../types/technicians.api'

export function useApproveTechnician() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: Technician['id']) => approveTechnician(id),
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.technicians.all })
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.technicians.detail(id) })
    },
  })
}

export function useRejectTechnician() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      reason,
    }: {
      id: Technician['id']
      reason?: string | null
    }) => rejectTechnician(id, { reason }),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.technicians.all })
      await queryClient.invalidateQueries({
        queryKey: queryKeys.admin.technicians.detail(variables.id),
      })
    },
  })
}
