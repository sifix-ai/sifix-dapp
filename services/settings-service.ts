// Settings Service – Client-side API calls for user settings (BYOAI provider)

const API_BASE = '/api/v1'

export interface AISettings {
  aiProvider: string
  aiApiKey: string | null
  aiBaseUrl: string | null
  aiModel: string | null
}

export interface SettingsResponse {
  success: boolean
  data: AISettings & { address: string; id: string; createdAt: string; updatedAt: string }
  error?: { code: string; message: string }
}

/**
 * Fetch AI provider settings for a given wallet address
 */
export async function fetchAISettings(address: string): Promise<SettingsResponse['data']> {
  const res = await fetch(`${API_BASE}/settings/ai-provider?address=${address}`)
  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    throw new Error(json?.error?.message || 'Failed to fetch settings')
  }
  const json: SettingsResponse = await res.json()
  return json.data
}

/**
 * Save (upsert) AI provider settings
 */
export async function saveAISettings(payload: {
  address: string
  aiProvider: string
  aiApiKey?: string
  aiBaseUrl?: string
  aiModel?: string
}): Promise<SettingsResponse['data']> {
  const res = await fetch(`${API_BASE}/settings/ai-provider`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    throw new Error(json?.error?.message || json?.error?.code || 'Failed to save settings')
  }
  const json: SettingsResponse = await res.json()
  return json.data
}

/**
 * Reset AI provider settings to defaults
 */
export async function resetAISettings(address: string): Promise<SettingsResponse['data']> {
  const res = await fetch(`${API_BASE}/settings/ai-provider?address=${address}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    throw new Error(json?.error?.message || 'Failed to reset settings')
  }
  const json: SettingsResponse = await res.json()
  return json.data
}
