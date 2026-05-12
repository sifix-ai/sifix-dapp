// Scan History Service – Client-side API calls for scan history

import { apiFetch } from '@/lib/api-client'

const API_BASE = '/api/v1'

export interface ScanRecord {
  id: string
  from: string
  to: string
  riskScore: number
  riskLevel: string
  recommendation: string
  reasoning: string | null
  threats: string[]
  confidence: number
  rootHash: string | null
  storageExplorer: string | null
  analyzedAt: string
}

export interface ScanStats {
  totalScans: number
  avgRiskScore: number
  maxRiskScore: number
}

export interface ScanHistoryPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ScanHistoryResponse {
  scans: ScanRecord[]
  stats: ScanStats
  pagination: ScanHistoryPagination
}

/**
 * Fetch paginated scan history for a given address
 */
export async function fetchScanHistory(params: {
  address: string
  page?: number
  limit?: number
}): Promise<ScanHistoryResponse> {
  const { address, page = 1, limit = 20 } = params
  const res = await apiFetch(
    `${API_BASE}/scan-history?address=${address}&page=${page}&limit=${limit}`
  )
  if (!res.ok) {
    throw new Error('Failed to fetch scan history')
  }
  const json = await res.json()
  // API wraps in { success, data }
  return json.data ?? json
}
