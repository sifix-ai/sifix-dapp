import { apiFetch } from '@/lib/api-client'

export async function fetchSystemStatus() {
  const res = await apiFetch('/api/v1/system-status')
  const result = await res.json()
  return result.success ? result.data : result
}
