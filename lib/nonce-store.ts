/**
 * Shared Nonce Store
 *
 * In-memory nonce store used by both /auth/nonce (generation) and
 * /auth/verify (consumption). Extracted from the nonce route so both
 * routes can share the same Map instance.
 *
 * For production, replace with Redis or a database-backed store.
 */

const nonceStore = new Map<string, { nonce: string; createdAt: number }>()

/** Nonce TTL — 5 minutes */
const NONCE_TTL_MS = 5 * 60 * 1000

/**
 * Store a nonce for a given wallet address (case-insensitive key).
 */
export function setNonce(walletAddress: string, nonce: string, createdAt: number): void {
  nonceStore.set(walletAddress.toLowerCase(), { nonce, createdAt })
}

/**
 * Retrieve **and consume** a nonce for a wallet address.
 * Returns null when no nonce exists or it has expired.
 * A successfully retrieved nonce is deleted to prevent replay.
 */
export function consumeNonce(walletAddress: string): { nonce: string; createdAt: number } | null {
  const entry = nonceStore.get(walletAddress.toLowerCase())
  if (!entry) return null

  // Check expiry
  if (Date.now() - entry.createdAt > NONCE_TTL_MS) {
    nonceStore.delete(walletAddress.toLowerCase())
    return null
  }

  // Consume — delete to prevent replay
  nonceStore.delete(walletAddress.toLowerCase())
  return entry
}

/**
 * Peek at a nonce without consuming it (useful for debugging).
 */
export function getNonce(walletAddress: string): { nonce: string; createdAt: number } | null {
  return nonceStore.get(walletAddress.toLowerCase()) ?? null
}

// ---------------------------------------------------------------------------
// Periodic cleanup — remove expired nonces every 5 minutes
// ---------------------------------------------------------------------------
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of nonceStore.entries()) {
    if (now - val.createdAt > NONCE_TTL_MS) {
      nonceStore.delete(key)
    }
  }
}, NONCE_TTL_MS)
