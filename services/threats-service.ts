import { apiFetch } from '@/lib/api-client'
import { reportThreatSchema } from '@/lib/validations'
import type { ReportThreat } from '@/lib/validations'

export async function fetchThreats(limit = 10) {
  try {
    const res = await apiFetch(`/api/v1/threats?limit=${limit}`)
    const text = await res.text()
    const result = text ? JSON.parse(text) : null
    if (!res.ok) {
      const message =
        result?.error?.message ||
        result?.error ||
        result?.message ||
        `Request failed with status ${res.status}`
      throw new Error(message)
    }
    return (result as any).success ? (result as any).data : result
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error')
  }
}

export async function reportThreat(data: ReportThreat) {
  try {
    const validated = reportThreatSchema.parse(data)
    const res = await apiFetch('/api/v1/threats', {
      method: 'POST',
      body: JSON.stringify(validated),
    })
    const text = await res.text()
    const result = text ? JSON.parse(text) : null
    if (!res.ok) {
      const message =
        result?.error?.message ||
        result?.error ||
        result?.message ||
        `Request failed with status ${res.status}`
      throw new Error(message)
    }
    return result
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error')
  }
}

export async function fetchThreatsByAddress(address: string, limit = 5) {
  const res = await apiFetch(`/api/v1/threats?address=${address}&limit=${limit}`)
  const result = await res.json()
  return result.success ? result.data : result
}
