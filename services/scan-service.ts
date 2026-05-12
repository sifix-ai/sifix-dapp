import { apiFetch } from '@/lib/api-client'
import { addressSchema, scanRequestSchema } from '@/lib/validations'
import type { ScanRequest } from '@/lib/validations'

export async function scanAddress(data: ScanRequest) {
  try {
    const validated = scanRequestSchema.parse(data)
    const res = await apiFetch('/api/v1/scan', {
      method: 'POST',
      body: JSON.stringify(validated),
    })
    const text = await res.text()
    const parsed = text ? JSON.parse(text) : null
    if (!res.ok) {
      const message =
        parsed?.error?.message ||
        parsed?.error ||
        parsed?.message ||
        `Request failed with status ${res.status}`
      throw new Error(message)
    }
    return parsed
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error')
  }
}

export async function fetchAddressReputation(address: string) {
  try {
    if (!address) throw new Error('Address is required')
    addressSchema.parse(address)
    const res = await apiFetch(`/api/v1/reputation/${address}`)
    const text = await res.text()
    const parsed = text ? JSON.parse(text) : null
    if (!res.ok) {
      const message =
        parsed?.error?.message ||
        parsed?.error ||
        parsed?.message ||
        `Request failed with status ${res.status}`
      throw new Error(message)
    }
    return parsed
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error')
  }
}

export async function scanAddressChecker(input: string, checkerAddress?: string) {
  const url = new URL(`/api/v1/scan/${encodeURIComponent(input.trim())}`, window.location.origin)
  if (checkerAddress) url.searchParams.set('checker', checkerAddress)

  const res = await apiFetch(url.toString())
  const result = await res.json()
  return result.success ? result.data : result
}
