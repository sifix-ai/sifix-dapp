import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { addressSchema, scanRequestSchema, reportThreatSchema } from '@/lib/validations'
import type { ScanRequest, ReportThreat } from '@/lib/validations'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// Helper to extract error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return 'An unexpected error occurred'
}

// Helper for API calls with better error handling
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
      // Try to parse error response
      let errorMessage = `Request failed with status ${response.status}`
      try {
        const errorData = await response.json()
        errorMessage = errorData?.error?.message || errorData?.message || errorMessage
      } catch {
        // If JSON parsing fails, use status text
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

// Scan address
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

// Get address reputation
export function useAddressReputation(address: string | undefined) {
  return useQuery({
    queryKey: ['reputation', address],
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
    staleTime: 30000, // 30 seconds
  })
}

// Get threat feed
export function useThreatFeed(limit = 10) {
  return useQuery({
    queryKey: ['threats', limit],
    queryFn: async () => {
      try {
        const result = await apiCall(`${API_BASE_URL}/api/v1/threats?limit=${limit}`)
        return (result as any).success ? (result as any).data : result
      } catch (error) {
        throw new Error(getErrorMessage(error))
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2,
    retryDelay: 2000,
    staleTime: 10000, // 10 seconds
  })
}

// Alias for useThreatFeed
export function useThreats(limit = 50) {
  return useThreatFeed(limit)
}

// Report threat
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
      // Invalidate threats query to refetch
      queryClient.invalidateQueries({ queryKey: ['threats'] })
    },
    retry: 1,
    retryDelay: 1000,
  })
}

// Get analytics stats
export function useAnalyticsStats() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      try {
        return await apiCall(`${API_BASE_URL}/api/v1/stats`)
      } catch (error) {
        throw new Error(getErrorMessage(error))
      }
    },
    refetchInterval: 60000, // Refetch every minute
    retry: 2,
    retryDelay: 2000,
    staleTime: 30000, // 30 seconds
  })
}

// Get leaderboard
export function useLeaderboard(limit = 10) {
  return useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: async () => {
      try {
        const result = await apiCall(`${API_BASE_URL}/api/v1/leaderboard?limit=${limit}`)
        return (result as any).success ? (result as any).data : result
      } catch (error) {
        throw new Error(getErrorMessage(error))
      }
    },
    refetchInterval: 60000, // Refetch every minute
    retry: 2,
    retryDelay: 2000,
    staleTime: 30000, // 30 seconds
  })
}
