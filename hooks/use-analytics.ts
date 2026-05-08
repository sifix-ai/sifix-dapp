import { useQuery } from '@tanstack/react-query'
import { fetchPlatformStats, fetchLeaderboard } from '@/services/dashboard-service'

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const analyticsKeys = {
  all: ['analytics'] as const,
  stats: () => [...analyticsKeys.all, 'stats'] as const,
  leaderboard: (limit?: number) => [...analyticsKeys.all, 'leaderboard', limit] as const,
} as const

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Platform analytics statistics */
export function useAnalyticsStats() {
  return useQuery({
    queryKey: analyticsKeys.stats(),
    queryFn: fetchPlatformStats,
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 2,
  })
}

/** Leaderboard data */
export function useLeaderboard(limit = 50) {
  return useQuery({
    queryKey: analyticsKeys.leaderboard(limit),
    queryFn: () => fetchLeaderboard(limit),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 2,
  })
}
