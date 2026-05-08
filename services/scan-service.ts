import {
  API_BASE_URL,
  apiCall,
  getErrorMessage,
} from '@/lib/api-client'
import { addressSchema, scanRequestSchema } from '@/lib/validations'
import type { ScanRequest } from '@/lib/validations'

export async function scanAddress(data: ScanRequest) {
  try {
    const validated = scanRequestSchema.parse(data)
    return await apiCall(`${API_BASE_URL}/api/v1/scan`, {
      method: 'POST',
      body: JSON.stringify(validated),
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function fetchAddressReputation(address: string) {
  try {
    if (!address) throw new Error('Address is required')
    addressSchema.parse(address)
    return await apiCall(`${API_BASE_URL}/api/v1/reputation/${address}`)
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
