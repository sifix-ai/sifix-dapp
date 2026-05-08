// Dashboard Service – Client-side API calls for dashboard/analytics/leaderboard data

const API_BASE = '/api/v1'

export interface PlatformStats {
  totalAddresses: number
  totalReports: number
  totalScans: number
  criticalThreats: number
  recentReports: number
}

export interface LeaderboardEntry {
  address: string
  overallScore: number
  reporterScore: number
  accuracyScore: number
  reportsSubmitted: number
  reportsVerified: number
}

export interface DashboardData {
  stats: PlatformStats | null
  recentThreats: any[]
}

/**
 * Fetch platform statistics
 */
export async function fetchPlatformStats(): Promise<PlatformStats> {
  const res = await fetch(`${API_BASE}/stats`)
  if (!res.ok) {
    throw new Error('Failed to fetch stats')
  }
  const json = await res.json()
  return json.data
}

/**
 * Fetch leaderboard entries
 */
export async function fetchLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${API_BASE}/leaderboard?limit=${limit}`)
  if (!res.ok) {
    throw new Error('Failed to fetch leaderboard')
  }
  const json = await res.json()

  // Route returns { success, data: { leaderboard: [...] } }
  const raw = json?.data?.leaderboard ?? json?.data ?? []

  if (!Array.isArray(raw)) return []

  return raw.map((entry: any) => ({
    address: entry.address,
    overallScore: entry.overallScore ?? entry.totalScore ?? 0,
    reporterScore: entry.reporterScore ?? 0,
    accuracyScore: entry.accuracyScore ?? 0,
    reportsSubmitted: entry.reportsSubmitted ?? entry.reportCount ?? 0,
    reportsVerified: entry.reportsVerified ?? 0,
  }))
}

/**
 * Fetch recent threats for dashboard activity feed
 */
export async function fetchRecentThreats(limit = 5): Promise<any[]> {
  const res = await fetch(`${API_BASE}/threats?limit=${limit}`)
  if (!res.ok) {
    throw new Error('Failed to fetch threats')
  }
  const json = await res.json()
  return json?.data?.reports || json?.data || []
}

/**
 * Combined dashboard loader
 */
export async function fetchDashboardData(limit = 5): Promise<DashboardData> {
  const [statsResult, threatsResult] = await Promise.allSettled([
    fetchPlatformStats(),
    fetchRecentThreats(limit),
  ])

  const stats = statsResult.status === 'fulfilled' ? statsResult.value : null
  const recentThreats = threatsResult.status === 'fulfilled' ? threatsResult.value : []

  return { stats, recentThreats }
}
