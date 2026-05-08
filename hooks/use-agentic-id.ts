import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAgenticIdConfig,
  checkAuthorization,
  requestAccess,
} from '@/services/agentic-id-service'

export const agenticIdKeys = {
  all: ['agentic-id'] as const,
  config: () => [...agenticIdKeys.all, 'config'] as const,
  auth: (address: string) => [...agenticIdKeys.all, 'auth', address] as const,
}

export function useAgenticIdConfig() {
  return useQuery({
    queryKey: agenticIdKeys.config(),
    queryFn: fetchAgenticIdConfig,
    staleTime: 30_000,
  })
}

export function useAgenticIdAuth(address?: string) {
  return useQuery({
    queryKey: agenticIdKeys.auth(address ?? ''),
    queryFn: () => checkAuthorization(address!),
    enabled: !!address,
    staleTime: 15_000,
  })
}

export function useRequestAccess() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (user: string) => requestAccess(user),
    onSuccess: (_data, user) => {
      queryClient.invalidateQueries({ queryKey: agenticIdKeys.auth(user) })
      queryClient.invalidateQueries({ queryKey: agenticIdKeys.config() })
    },
  })
}
