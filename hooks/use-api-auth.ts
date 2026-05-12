'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { authenticateExtension, type VerifyResponse } from '@/services/extension-auth-service'

const TOKEN_STORAGE_KEY = 'sifix_api_token'
const TOKEN_EXPIRY_KEY = 'sifix_api_token_expires'

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
  const isAuthenticating = useRef(false)
  // Track the address we last authed for — prevent re-auth on same address
  const lastAuthedAddress = useRef<string | null>(null)

  // Load cached token from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const cached = localStorage.getItem(TOKEN_STORAGE_KEY)
      const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
      if (cached && expiry && new Date(expiry) > new Date()) {
        setToken(cached)
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        localStorage.removeItem(TOKEN_EXPIRY_KEY)
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  const persistToken = useCallback((response: VerifyResponse) => {
    setToken(response.token)
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, response.token)
      localStorage.setItem(TOKEN_EXPIRY_KEY, response.expiresAt)
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
      lastAuthedAddress.current = address
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

  // Auto-authenticate when wallet connects (if no cached token)
  // Only trigger once per address change
  useEffect(() => {
    if (
      isConnected &&
      address &&
      !token &&
      !isLoading &&
      !isAuthenticating.current &&
      lastAuthedAddress.current !== address
    ) {
      authenticate()
    }
  }, [isConnected, address, token, isLoading, authenticate])

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
