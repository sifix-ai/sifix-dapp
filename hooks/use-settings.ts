import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAISettings, saveAISettings } from '@/services/settings-service'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AIProviderSettings {
  aiProvider?: string
  aiApiKey?: string
  aiBaseUrl?: string
  aiModel?: string
}

export interface UpdateAIProviderSettingsInput {
  address: string
  aiProvider: string
  aiApiKey?: string
  aiBaseUrl?: string
  aiModel?: string
}

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const settingsKeys = {
  all: ['settings'] as const,
  aiProvider: (address: string) => [...settingsKeys.all, 'ai-provider', address] as const,
} as const

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Load BYOAI provider settings for the connected wallet */
export function useAIProviderSettings(address?: string) {
  return useQuery({
    queryKey: settingsKeys.aiProvider(address ?? ''),
    queryFn: () => fetchAISettings(address!),
    enabled: !!address,
    staleTime: 30_000,
    retry: 1,
  })
}

/** Save BYOAI provider settings and invalidate dependent settings queries */
export function useUpdateAIProviderSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveAISettings,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: settingsKeys.aiProvider(variables.address),
      })
    },
  })
}
