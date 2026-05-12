import { apiFetch } from '@/lib/api-client'

export async function fetchTags(limit = 50, view: 'addresses' | 'tags' = 'addresses') {
  const res = await apiFetch(`/api/v1/tags?limit=${limit}&view=${view}`)
  const result = await res.json()
  return result.data || []
}

export async function addTag(address: string, tag: string, label?: string) {
  const res = await apiFetch(`/api/v1/address/${address}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tag, label: label ?? tag }),
  })
  const result = await res.json()
  return result.data
}
