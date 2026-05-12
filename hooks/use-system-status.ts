import { useQuery } from '@tanstack/react-query'
import { fetchSystemStatus } from '@/services/system-status-service'

export function useSystemStatus() {
  return useQuery({
    queryKey: ['system-status'],
    queryFn: fetchSystemStatus,
    refetchInterval: 30000,
    staleTime: 15000,
  })
}
