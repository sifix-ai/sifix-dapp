import { useMutation, useQuery } from '@tanstack/react-query'
import { scanAddress, fetchAddressReputation } from '@/services/scan-service'
import type { ScanRequest } from '@/lib/validations'

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const scanKeys = {
  all: ['scan'] as const,
  reputation: (address: string) => [...scanKeys.all, 'reputation', address] as const,
} as const

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Scan an address for threats */
export function useScanAddress() {
  return useMutation({
    mutationFn: (data: ScanRequest) => scanAddress(data),
    retry: 1,
    retryDelay: 1000,
  })
}

/** Fetch reputation data for a given address */
export function useAddressReputation(address: string | undefined) {
  return useQuery({
    queryKey: scanKeys.reputation(address ?? ''),
    queryFn: () => fetchAddressReputation(address!),
    enabled: !!address,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 30_000,
  })
}
