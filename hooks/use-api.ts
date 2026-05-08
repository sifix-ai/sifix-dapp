import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { addressSchema, scanRequestSchema, reportThreatSchema } from '@/lib/validations'
import type { ScanRequest, ReportThreat } from '@/lib/validations'
import { fetchAISettings, saveAISettings, resetAISettings } from '@/services/settings-service'
import { fetchScanHistory } from '@/services/scan-history-service'
import { authenticateExtension } from '@/services/extension-auth-service'
import { fetchDashboardData, fetchPlatformStats, fetchLeaderboard } from '@/services/dashboard-service'
import type { ScanHistoryResponse } from '@/services/scan-history-service'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// ─── Helpers ────────────────────────────────────────────────────────────────

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return 'An unexpected error occurred'
}

async function apiCall<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData?.error?.message || errorData?.message || errorMessage
      } catch {
        errorMessage = response.statusText || errorMessage
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.')
    }
    throw error
  }
}

// ─── Query Key Factories ────────────────────────────────────────────────────

export const queryKeys = {
  analytics: ['analytics'] as const,
  leaderboard: (limit?: number) => ['leaderboard', limit] as const,
  threats: (limit?: number) => ['threats', limit] as const,
  reputation: (address: string) => ['reputation', address] as const,
  aiSettings: (address: string) => ['settings', 'ai-provider', address] as const,
  scanHistory: (address: string, page?: number, limit?: number) =>
    ['scan-history', address, page, limit] as const,
  dashboardStats: ['dashboard', 'stats'] as const,
}

// ─── Scan / Address Hooks ───────────────────────────────────────────────────

export function useScanAddress() {
  return useMutation({
    mutationFn: async (data: ScanRequest) => {
      try {
        const validated = scanRequestSchema.parse(data)
        return await apiCall(`${API_BASE_URL}/api/v1/scan`, {
          method: 'POST',
          body: JSON.stringify(validated),
        })
      } catch (error) {
        throw new Error(getErrorMessage(error))
      }
    },
    retry: 1,
    retryDelay: 1000,
  })
}

export function useAddressReputation(address: string | undefined) {
  return useQuery({
    queryKey: queryKeys.reputation(address ?? ''),
    queryFn: async () => {
      try {
        if (!address) throw new Error('Address is required')
        addressSchema.parse(address)
        return await apiCall(`${API_BASE_URL}/api/v1/reputation/${address}`)
      } catch (error) {
        throw new Error(getErrorMessage(error))
      }
    },
    enabled: !!address,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 30000,
  })
}

// ─── Threats Hooks ──────────────────────────────────────────────────────────

export function useThreatFeed(limit = 10) {
  return useQuery({
    queryKey: queryKeys.threats(limit),
    queryFn: async () => {
      try {
        const result = await apiCall(`${API_BASE_URL}/api/v1/threats?limit=${limit}`)
        return (result as any).success ? (result as any).data : result
      } catch (error) {
        throw new Error(getErrorMessage(error))
      }
    },
    refetchInterval: 30000,
    retry: 2,
    retryDelay: 2000,
    staleTime: 10000,
  })
}

export function useThreats(limit = 50) {
  return useThreatFeed(limit)
}

export function useReportThreat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ReportThreat) => {
      try {
        const validated = reportThreatSchema.parse(data)
        return await apiCall(`${API_BASE_URL}/api/v1/threats/report`, {
          method: 'POST',
          body: JSON.stringify(validated),
        })
      } catch (error) {
        throw new Error(getErrorMessage(error))
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threats'] })
    },
    retry: 1,
    retryDelay: 1000,
  })
}

// ─── Analytics / Leaderboard Hooks ──────────────────────────────────────────

export function useAnalyticsStats() {
  return useQuery({
    queryKey: queryKeys.analytics,
    queryFn: fetchPlatformStats,
    refetchInterval: 60000,
    retry: 2,
    retryDelay: 2000,
    staleTime: 30000,
  })
}

export function useLeaderboard(limit = 10) {
  return useQuery({
    queryKey: queryKeys.leaderboard(limit),
    queryFn: () => fetchLeaderboard(limit),
    refetchInterval: 60000,
    retry: 2,
    retryDelay: 2000,
    staleTime: 30000,
  })
}

// ─── Dashboard Hook (combined stats + recent threats) ────────────────────────

export interface DashboardData {
  stats: {
    totalAddresses: number
    totalReports: number
    totalScans: number
    criticalThreats: number
    recentReports: number
  } | null
  recentThreats: any[]
}

export function useDashboardData() {
  return useQuery<DashboardData>({
    queryKey: queryKeys.dashboardStats,
    queryFn: async () => {
      const [statsRes, threatsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/stats`).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/threats?limit=5`).catch(() => null),
      ])

      let stats: DashboardData['stats'] = null
      let recentThreats: any[] = []

      if (statsRes?.ok) {
        const statsJson = await statsRes.json()
        if (statsJson.success) stats = statsJson.data
      }
      if (threatsRes?.ok) {
        const threatsJson = await threatsRes.json()
        if (threatsJson.success) {
          recentThreats = threatsJson.data?.reports || threatsJson.data || []
        }
      }

      return { stats, recentThreats }
    },
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 1,
  })
}

// ─── Settings Hooks (BYOAI) ─────────────────────────────────────────────────

export function useAISettings(address: string | undefined) {
  return useQuery({
    queryKey: queryKeys.aiSettings(address ?? ''),
    queryFn: () => fetchAISettings(address!),
    enabled: !!address,
    staleTime: 60000,
  })
}

export function useSaveAISettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveAISettings,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.aiSettings(variables.address),
      })
    },
  })
}

export function useResetAISettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: resetAISettings,
    onSuccess: (_data, address) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.aiSettings(address),
      })
    },
  })
}

// ─── Scan History Hooks ─────────────────────────────────────────────────────

export function useScanHistory(
  address: string | undefined,
  page = 1,
  limit = 20,
) {
  return useQuery<ScanHistoryResponse>({
    queryKey: queryKeys.scanHistory(address ?? '', page, limit),
    queryFn: () => fetchScanHistory({ address: address!, page, limit }),
    enabled: !!address,
    staleTime: 15000,
  })
}

// ─── Extension Auth Hook ────────────────────────────────────────────────────

export function useExtensionAuth() {
  return useMutation({
    mutationFn: async (params: {
      walletAddress: string
      signMessage: (message: string, address: string) => Promise<string>
    }) => {
      return authenticateExtension(params)
    },
  })
}
