'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { authenticateExtension, type VerifyResponse } from '@/services/extension-auth-service'

const TOKEN_STORAGE_KEY = 'sifix_api_token'
const TOKEN_EXPIRY_KEY = 'sifix_api_token_expires'
const TOKEN_WALLET_KEY = 'sifix_api_token_wallet'

export interface UseApiAuthReturn {
  /** The current Bearer token, or null if not authenticated */
  token: string | null
  /** True while authentication is in progress */
  isLoading: boolean
  /** Error message if authentication failed */
  error: string | null
  /** Manually trigger authentication */
  authenticate: () => Promise<string | null>
  /** Clear the stored token */
  logout: () => void
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean
}

/**
 * Hook for dApp frontend auto-authentication.
 *
 * Uses the existing nonce → sign → verify flow via wagmi's signMessage.
 * Stores the Bearer token in localStorage and auto-triggers when wallet connects.
 */
export function useApiAuth(): UseApiAuthReturn {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasRestoredToken, setHasRestoredToken] = useState(false)
  const isAuthenticating = useRef(false)
  // Track the address we last authed for — prevent re-auth on same address
  const lastAuthedAddress = useRef<string | null>(null)

  // Load cached token from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const cached = localStorage.getItem(TOKEN_STORAGE_KEY)
      const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
      const wallet = localStorage.getItem(TOKEN_WALLET_KEY)
      if (cached && expiry && new Date(expiry) > new Date()) {
        setToken(cached)
        if (wallet) {
          lastAuthedAddress.current = wallet.toLowerCase()
        }
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        localStorage.removeItem(TOKEN_EXPIRY_KEY)
        localStorage.removeItem(TOKEN_WALLET_KEY)
      }
    } catch {
      // Ignore localStorage errors
    } finally {
      setHasRestoredToken(true)
    }
  }, [])

  const persistToken = useCallback((response: VerifyResponse) => {
    setToken(response.token)
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, response.token)
      localStorage.setItem(TOKEN_EXPIRY_KEY, response.expiresAt)
      localStorage.setItem(TOKEN_WALLET_KEY, response.walletAddress.toLowerCase())
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  const clearToken = useCallback(() => {
    setToken(null)
    setError(null)
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      localStorage.removeItem(TOKEN_EXPIRY_KEY)
      localStorage.removeItem(TOKEN_WALLET_KEY)
    } catch {
      // Ignore
    }
  }, [])

  const authenticate = useCallback(async (): Promise<string | null> => {
    if (!address || !isConnected) {
      setError('Wallet not connected')
      return null
    }

    if (isAuthenticating.current) return token

    const normalizedAddress = address.toLowerCase()

    setIsLoading(true)
    setError(null)
    isAuthenticating.current = true

    try {
      const result = await authenticateExtension({
        walletAddress: address,
        signMessage: async (message: string) => {
          return signMessageAsync({ message })
        },
      })

      persistToken(result)
      lastAuthedAddress.current = normalizedAddress
      console.log('[Auth] Token obtained for', address)
      return result.token
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed'
      console.error('[Auth] Failed:', msg)
      setError(msg)
      clearToken()
      return null
    } finally {
      setIsLoading(false)
      isAuthenticating.current = false
    }
  }, [address, isConnected, signMessageAsync, persistToken, clearToken, token])

  const logout = useCallback(() => {
    clearToken()
    lastAuthedAddress.current = null
  }, [clearToken])

  // Keep token tied to current wallet address across reloads
  useEffect(() => {
    if (!hasRestoredToken || typeof window === 'undefined') return

    if (!isConnected || !address) {
      return
    }

    const normalizedAddress = address.toLowerCase()
    const tokenWallet = localStorage.getItem(TOKEN_WALLET_KEY)?.toLowerCase()

    if (token && tokenWallet && tokenWallet !== normalizedAddress) {
      clearToken()
      lastAuthedAddress.current = null
      return
    }

    if (token && !tokenWallet) {
      localStorage.setItem(TOKEN_WALLET_KEY, normalizedAddress)
      lastAuthedAddress.current = normalizedAddress
    }
  }, [address, clearToken, hasRestoredToken, isConnected, token])

  // Do not auto-sign on wallet connect / page reload.
  // Authentication should happen only from explicit user action in the UI.
  useEffect(() => {
    if (!hasRestoredToken || !isConnected || !address) {
      return
    }

    const normalizedAddress = address.toLowerCase()
    const tokenWallet = typeof window !== 'undefined'
      ? localStorage.getItem(TOKEN_WALLET_KEY)?.toLowerCase()
      : null

    if (token && tokenWallet === normalizedAddress) {
      lastAuthedAddress.current = normalizedAddress
    }
  }, [address, hasRestoredToken, isConnected, token])

  // Clear token when wallet disconnects
  useEffect(() => {
    if (!isConnected && token) {
      clearToken()
      lastAuthedAddress.current = null
    }
  }, [isConnected, token, clearToken])

  return {
    token,
    isLoading,
    error,
    authenticate,
    logout,
    isAuthenticated: !!token,
  }
}
