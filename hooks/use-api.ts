import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { addressSchema, scanRequestSchema, reportThreatSchema } from '@/lib/validations'
import type { ScanRequest, ReportThreat } from '@/lib/validations'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// Scan address
export function useScanAddress() {
  return useMutation({
    mutationFn: async (data: ScanRequest) => {
      const validated = scanRequestSchema.parse(data)
      const response = await fetch(`${API_BASE_URL}/api/v1/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      })
      if (!response.ok) throw new Error('Scan failed')
      return response.json()
    },
  })
}

// Get address reputation
export function useAddressReputation(address: string | undefined) {
  return useQuery({
    queryKey: ['reputation', address],
    queryFn: async () => {
      if (!address) throw new Error('Address is required')
      addressSchema.parse(address)
      const response = await fetch(`${API_BASE_URL}/api/v1/reputation/${address}`)
      if (!response.ok) throw new Error('Failed to fetch reputation')
      return response.json()
    },
    enabled: !!address,
  })
}

// Get threat feed
export function useThreatFeed(limit = 10) {
  return useQuery({
    queryKey: ['threats', limit],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/v1/threats?limit=${limit}`)
      if (!response.ok) throw new Error('Failed to fetch threats')
      const result = await response.json()
      return result.success ? result.data : result
    },
    refetchInterval: 30000, // Refetch every 30 seconds
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
      const validated = reportThreatSchema.parse(data)
      const response = await fetch(`${API_BASE_URL}/api/v1/threats/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      })
      if (!response.ok) throw new Error('Report failed')
      return response.json()
    },
    onSuccess: () => {
      // Invalidate threats query to refetch
      queryClient.invalidateQueries({ queryKey: ['threats'] })
    },
  })
}

// Get analytics stats
export function useAnalyticsStats() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/v1/stats`)
      if (!response.ok) throw new Error('Failed to fetch stats')
      return response.json()
    },
    refetchInterval: 60000, // Refetch every minute
  })
}
