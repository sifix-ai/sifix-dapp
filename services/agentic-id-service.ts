const API_BASE = '/api/v1'

export interface AgenticIdConfig {
  enabled: boolean
  authorized: boolean
  reason: string
  tokenId?: string
  profile?: {
    tokenId: string
    owner: string
    creator: string
    cloneSource: string
    intelligentData: Array<{
      dataDescription: string
      dataHash: string
    }>
    authorizedUsers: string[]
    metadata: {
      name: string
      model: string
      provider: string
      capabilities: string[]
    }
    knownHash: string
    hashVerified: boolean
  }
}

export interface AuthCheckResult {
  enabled: boolean
  authorized: boolean
  reason: string
  tokenId?: string
}

export interface AuthorizeResult {
  success: boolean
  txHash?: string
  error?: string
}

export async function fetchAgenticIdConfig(): Promise<AgenticIdConfig> {
  const res = await fetch(`${API_BASE}/agentic-id`)
  const data = await res.json()
  if (!data.success) throw new Error(data.error || 'Failed to fetch config')
  return data.data
}

export async function checkAuthorization(user: string): Promise<AuthCheckResult> {
  const res = await fetch(`${API_BASE}/agentic-id`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'check', user }),
  })
  const data = await res.json()
  if (!data.success) throw new Error(data.error || 'Failed to check authorization')
  return data.data
}

export async function requestAccess(user: string): Promise<AuthorizeResult> {
  const res = await fetch(`${API_BASE}/agentic-id`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'authorize', user }),
  })
  const data = await res.json()
  if (!res.ok || !data?.success) {
    throw new Error(data?.error || data?.message || 'Failed to request access')
  }
  return { success: true, txHash: data.data?.txHash }
}
