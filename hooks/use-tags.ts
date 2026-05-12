import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchTags, addTag } from '@/services/tags-service'

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const tagKeys = {
  all: ['tags'] as const,
  list: (limit?: number, view?: 'addresses' | 'tags') => [...tagKeys.all, 'list', limit, view] as const,
} as const

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useTags(limit = 50, view: 'addresses' | 'tags' = 'addresses') {
  return useQuery({
    queryKey: tagKeys.list(limit, view),
    queryFn: () => fetchTags(limit, view),
  })
}

export function useAddTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ address, tag, label }: { address: string; tag: string; label?: string }) =>
      addTag(address, tag, label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.all })
    },
  })
}
