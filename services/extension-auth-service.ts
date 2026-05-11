// Extension Auth Service – Client-side API calls for extension wallet-based auth

const API_BASE = '/api/v1'

export interface NonceResponse {
  message: string
}

export interface VerifyResponse {
  success: boolean
  token: string
  walletAddress: string
  expiresAt: string
  error?: string
}

/**
 * Request a sign-in nonce for the given wallet address
 */
export async function fetchNonce(walletAddress: string): Promise<NonceResponse> {
  const res = await fetch(`${API_BASE}/auth/nonce?walletAddress=${walletAddress}`)
  const json = await res.json()
  if (!json.message) {
    throw new Error('Failed to obtain nonce')
  }
  return json
}

/**
 * Verify a signed message and receive an extension auth token
 */
export async function verifySignature(payload: {
  walletAddress: string
  signature: string
  message: string
}): Promise<VerifyResponse> {
  const res = await fetch(`${API_BASE}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const json: VerifyResponse & { success?: boolean; error?: string } = await res.json()
  if (!json.success || !json.token) {
    throw new Error(json.error || 'Verification failed')
  }
  return json
}

/**
 * Full extension auth flow: get nonce → sign → verify.
 * Returns the auth token on success.
 *
 * The `signMessage` callback is platform-dependent (window.ethereum or wagmi).
 */
export async function authenticateExtension(params: {
  walletAddress: string
  signMessage: (message: string) => Promise<string>
}): Promise<VerifyResponse> {
  const { walletAddress, signMessage } = params

  // 1. Get nonce
  const nonceData = await fetchNonce(walletAddress)

  // 2. Request signature from wallet
  const signature = await signMessage(nonceData.message)

  // 3. Verify signature
  return verifySignature({
    walletAddress,
    signature,
    message: nonceData.message,
  })
}
