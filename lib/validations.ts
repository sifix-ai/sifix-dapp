import { z } from 'zod'

// Address validation
export const addressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')

// Scan request validation
export const scanRequestSchema = z.object({
  address: addressSchema,
})

export type ScanRequest = z.infer<typeof scanRequestSchema>

// Report threat validation
export const reportThreatSchema = z.object({
  address: addressSchema,
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  type: z.string().min(1, 'Threat type is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  evidence: z.object({
    transactionData: z.any().optional(),
    simulationResult: z.any().optional(),
    aiAnalysis: z.string().optional(),
  }).optional(),
})

export type ReportThreat = z.infer<typeof reportThreatSchema>

// Search validation
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  type: z.enum(['address', 'transaction']).optional(),
})

export type Search = z.infer<typeof searchSchema>
