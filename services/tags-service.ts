import { apiFetch } from '@/lib/api-client'

export async function fetchTags(limit = 50) {
  const res = await apiFetch(`/api/v1/tags?limit=${limit}`)
  const result = await res.json()
  return result.success ? result.data : result
}

export async function addTag(address: string, tag: string, label?: string) {
  const res = await apiFetch(`/api/v1/address/${address}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tag, label: label ?? tag }),
  })
  const result = await res.json()
  return result.success ? result.data : result
}
