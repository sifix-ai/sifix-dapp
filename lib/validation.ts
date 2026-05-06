import { z } from 'zod';

/**
 * Ethereum address validation
 */
export const addressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address');

/**
 * Transaction hash validation
 */
export const txHashSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash');

/**
 * Scan request validation
 */
export const scanRequestSchema = z.object({
  address: addressSchema,
});

export type ScanRequest = z.infer<typeof scanRequestSchema>;

/**
 * Report threat validation
 */
export const reportThreatSchema = z.object({
  address: addressSchema,
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  type: z.string().min(1, 'Threat type is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  evidence: z.object({
    transactionHash: txHashSchema.optional(),
    transactionData: z.any().optional(),
    simulationResult: z.any().optional(),
    aiAnalysis: z.string().optional(),
  }).optional(),
});

export type ReportThreat = z.infer<typeof reportThreatSchema>;

/**
 * Search validation
 */
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  type: z.enum(['address', 'transaction']).optional(),
});

export type Search = z.infer<typeof searchSchema>;

/**
 * Validate and normalize Ethereum address
 */
export function validateAddress(address: string): string {
  const result = addressSchema.safeParse(address);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data.toLowerCase();
}

/**
 * Validate transaction hash
 */
export function validateTxHash(hash: string): string {
  const result = txHashSchema.safeParse(hash);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data.toLowerCase();
}
