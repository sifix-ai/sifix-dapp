import {
  API_BASE_URL,
  apiCall,
  getErrorMessage,
} from '@/lib/api-client'
import { reportThreatSchema } from '@/lib/validations'
import type { ReportThreat } from '@/lib/validations'

export async function fetchThreats(limit = 10) {
  try {
    const result = await apiCall(`${API_BASE_URL}/api/v1/threats?limit=${limit}`)
    return (result as any).success ? (result as any).data : result
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function reportThreat(data: ReportThreat) {
  try {
    const validated = reportThreatSchema.parse(data)
    return await apiCall(`${API_BASE_URL}/api/v1/threats`, {
      method: 'POST',
      body: JSON.stringify(validated),
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
