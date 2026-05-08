import { useQuery } from '@tanstack/react-query'
import { fetchPlatformStats, fetchRecentThreats } from '@/services/dashboard-service'

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  recentThreats: (limit?: number) => [...dashboardKeys.all, 'threats', limit] as const,
} as const

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Platform-wide statistics (totalAddresses, totalReports, totalScans, criticalThreats, recentReports, topReporters) */
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: fetchPlatformStats,
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 2,
  })
}

/** Recent threats for the dashboard activity feed */
export function useRecentThreats(limit = 5) {
  return useQuery({
    queryKey: dashboardKeys.recentThreats(limit),
    queryFn: () => fetchRecentThreats(limit),
    staleTime: 15_000,
    refetchInterval: 30_000,
    retry: 1,
  })
}
