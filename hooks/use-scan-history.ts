import { useQuery } from '@tanstack/react-query'
import { fetchScanHistory } from '@/services/scan-history-service'
import type { ScanHistoryResponse, ScanRecord, ScanStats } from '@/services/scan-history-service'

// Re-export types for consumers
export type { ScanRecord, ScanStats }

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const scanHistoryKeys = {
  all: ['scan-history'] as const,
  list: (address: string, page: number, limit: number) =>
    [...scanHistoryKeys.all, address, page, limit] as const,
} as const

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Scan history for a given address, with pagination */
export function useScanHistory(
  address: string | undefined,
  page: number = 1,
  limit: number = 20,
) {
  return useQuery<ScanHistoryResponse>({
    queryKey: scanHistoryKeys.list(address ?? '', page, limit),
    queryFn: () => fetchScanHistory({ address: address!, page, limit }),
    enabled: !!address,
    staleTime: 15_000,
    retry: 1,
  })
}
