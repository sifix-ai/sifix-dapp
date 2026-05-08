/**
 * Address Validation Helpers
 *
 * Centralised Ethereum address validation used across all API routes.
 * Every route that accepts an address parameter should call
 * `isValidEthereumAddress()` or `validateAddress()`.
 */

/**
 * Check whether a string is a valid Ethereum address.
 * - Must start with `0x`
 * - Must be exactly 42 characters
 * - Remaining 40 chars must be hex
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Validate an address and return a normalised (lowercased) version.
 * Throws if the address is invalid.
 */
export function validateAddress(address: string): string {
  if (!address || typeof address !== 'string') {
    throw new Error('Address is required')
  }
  if (!isValidEthereumAddress(address)) {
    throw new Error('Invalid Ethereum address format')
  }
  return address.toLowerCase()
}

/**
 * Safely validate an address. Returns the normalised address or `null`.
 */
export function safeValidateAddress(address: string): string | null {
  try {
    return validateAddress(address)
  } catch {
    return null
  }
}
