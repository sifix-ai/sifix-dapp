import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { scanAddressChecker } from '@/services/scan-service'
import { fetchThreatsByAddress } from '@/services/threats-service'

export const checkerKeys = {
  all: ['checker'] as const,
  scan: (input: string, walletAddress?: string) => [...checkerKeys.all, 'scan', input, walletAddress] as const,
  threats: (address: string, limit?: number) => [...checkerKeys.all, 'threats', address, limit] as const,
} as const

/** Imperative scan — useMutation so page triggers it on form submit / auto-run */
export function useCheckerScan() {
  return useMutation({
    mutationFn: ({ input, walletAddress }: { input: string; walletAddress?: string }) =>
      scanAddressChecker(input, walletAddress),
  })
}

/** Fetch threat reports for a specific address */
export function useAddressThreats(address: string | undefined, limit = 5) {
  return useQuery({
    queryKey: checkerKeys.threats(address ?? '', limit),
    queryFn: () => fetchThreatsByAddress(address!, limit),
    enabled: !!address,
  })
}
