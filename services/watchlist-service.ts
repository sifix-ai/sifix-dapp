import { apiFetch } from '@/lib/api-client'

export async function fetchWatchlist(userAddress: string) {
  const res = await apiFetch(`/api/v1/watchlist?userAddress=${userAddress}`)
  const result = await res.json()
  return result.success ? result.data : result
}

export async function addToWatchlist(userAddress: string, watchedAddress: string, label?: string) {
  const res = await apiFetch('/api/v1/watchlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userAddress,
      watchedAddress,
      label: label || undefined,
    }),
  })
  const result = await res.json()
  return result.success ? result.data : result
}

export async function removeFromWatchlist(watchedAddress: string, userAddress: string) {
  const res = await apiFetch(`/api/v1/watchlist/${watchedAddress}?userAddress=${userAddress}`, {
    method: 'DELETE',
  })
  const result = await res.json()
  return result.success ? result.data : result
}
