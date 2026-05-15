import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { queryKeys } from '../constants/queryKeys'
import { deleteAdminUser } from '../services/adminService'
import type { AdminDirectoryUserType } from '../types/users.api'

async function invalidateUserLists(queryClient: QueryClient) {
  await queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all })
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, user_type }: { id: number; user_type: AdminDirectoryUserType }) =>
      deleteAdminUser(id, user_type),
    onSuccess: async () => {
      await invalidateUserLists(queryClient)
    },
  })
}
