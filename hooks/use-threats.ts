import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchThreats, reportThreat } from '@/services/threats-service'
import type { ReportThreat } from '@/lib/validations'

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const threatsKeys = {
  all: ['threats'] as const,
  feed: (limit?: number) => [...threatsKeys.all, 'feed', limit] as const,
} as const

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Threat feed – auto-refreshes every 30 s */
export function useThreatFeed(limit = 10) {
  return useQuery({
    queryKey: threatsKeys.feed(limit),
    queryFn: () => fetchThreats(limit),
    refetchInterval: 30_000,
    retry: 2,
    retryDelay: 2000,
    staleTime: 10_000,
  })
}

/** Alias used by some consumers */
export function useThreats(limit = 50) {
  return useThreatFeed(limit)
}

/** Report a new threat – invalidates the feed on success */
export function useReportThreat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ReportThreat) => reportThreat(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: threatsKeys.all })
    },
    retry: 1,
    retryDelay: 1000,
  })
}
