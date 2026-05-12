import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchWatchlist, addToWatchlist, removeFromWatchlist } from '@/services/watchlist-service'

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const watchlistKeys = {
  all: ['watchlist'] as const,
  list: (userAddress: string) => [...watchlistKeys.all, 'list', userAddress] as const,
} as const

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useWatchlist(userAddress: string | undefined) {
  return useQuery({
    queryKey: watchlistKeys.list(userAddress ?? ''),
    queryFn: () => fetchWatchlist(userAddress!),
    enabled: !!userAddress,
  })
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userAddress, watchedAddress, label }: { userAddress: string; watchedAddress: string; label?: string }) =>
      addToWatchlist(userAddress, watchedAddress, label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all })
    },
  })
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ watchedAddress, userAddress }: { watchedAddress: string; userAddress: string }) =>
      removeFromWatchlist(watchedAddress, userAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: watchlistKeys.all })
    },
  })
}
