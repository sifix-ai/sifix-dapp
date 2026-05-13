import { useQuery } from '@tanstack/react-query'
import { fetchPlatformStats, fetchLeaderboard, fetchRecentPredictions } from '@/services/dashboard-service'

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const analyticsKeys = {
  all: ['analytics'] as const,
  stats: () => [...analyticsKeys.all, 'stats'] as const,
  leaderboard: (limit?: number) => [...analyticsKeys.all, 'leaderboard', limit] as const,
  predictions: (filter?: string, limit?: number) => [...analyticsKeys.all, 'predictions', filter, limit] as const,
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

export function useRecentPredictions(
  filter: 'all' | 'resolved' | 'unresolved' | 'false_positive' | 'false_negative' = 'all',
  limit = 25,
) {
  return useQuery({
    queryKey: analyticsKeys.predictions(filter, limit),
    queryFn: () => fetchRecentPredictions(filter, limit),
    staleTime: 20_000,
    refetchInterval: 30_000,
    retry: 2,
  })
}
