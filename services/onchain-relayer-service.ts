import { createPublicClient, createWalletClient, defineChain, http, keccak256, stringToHex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { CONTRACT_ADDRESSES, SCAM_REPORTER_ABI, ZEROG_CHAIN_ID } from '@/config/contracts'

const chain = defineChain({
  id: ZEROG_CHAIN_ID,
  name: '0G Galileo',
  network: '0g-galileo',
  nativeCurrency: { name: 'A0GI', symbol: 'A0GI', decimals: 18 },
  rpcUrls: { default: { http: [process.env.ZERO_G_RPC_URL || 'https://evmrpc-testnet.0g.ai'] } },
})

const publicClient = createPublicClient({ chain, transport: http() })

function getWalletClient() {
  const pk = (process.env.PRIVATE_KEY || process.env.COMPUTE_PRIVATE_KEY) as `0x${string}` | undefined
  if (!pk) throw new Error('Missing PRIVATE_KEY/COMPUTE_PRIVATE_KEY for relayer')
  const account = privateKeyToAccount(pk)
  return createWalletClient({ account, chain, transport: http() })
}

// ============================================
// RETRY POLICY CONFIGURATION
// ============================================

export const RELAY_RETRY_POLICY = {
  MAX_ATTEMPTS: 3, // Max retry attempts before marking as dead letter
  BACKOFF_MS: [
    1_000,  // 1 second for 1st retry
    5_000,  // 5 seconds for 2nd retry
    15_000, // 15 seconds for 3rd retry
  ],
} as const

/**
 * Sleep utility for backoff
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export class OnchainRelayerService {
  static buildReportHash(reportId: string, address: string, explanation: string) {
    return keccak256(stringToHex(`${reportId}:${address.toLowerCase()}:${explanation}`))
  }

  /**
   * Submit report vote with retry policy
   * Implements exponential backoff and dead-letter queue pattern
   */
  static async submitReportVote(
    targetAddress: string,
    reportHash: `0x${string}`,
    isScam: boolean
  ): Promise<{ txHash: `0x${string}`; blockNumber: number; contractAddress: `0x${string}`; chainId: number }> {
    let lastError: Error | null = null

    for (let attempt = 0; attempt < RELAY_RETRY_POLICY.MAX_ATTEMPTS; attempt++) {
      try {
        const wallet = getWalletClient()
        const contract = CONTRACT_ADDRESSES[ZEROG_CHAIN_ID].ScamReporter as `0x${string}`

        const targetId = await publicClient.readContract({
          address: contract,
          abi: SCAM_REPORTER_ABI,
          functionName: 'addressToTargetId',
          args: [targetAddress as `0x${string}`],
        }) as `0x${string}`

        const txHash = await wallet.writeContract({
          address: contract,
          abi: SCAM_REPORTER_ABI,
          functionName: 'submitVote',
          args: [0, targetId, reportHash, isScam],
        })

        const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash })

        return {
          txHash,
          blockNumber: Number(receipt.blockNumber),
          contractAddress: contract,
          chainId: ZEROG_CHAIN_ID,
        }
      } catch (e: any) {
        lastError = e

        // If this is not the last attempt, apply backoff and retry
        if (attempt < RELAY_RETRY_POLICY.MAX_ATTEMPTS - 1) {
          const backoffMs = RELAY_RETRY_POLICY.BACKOFF_MS[attempt] || RELAY_RETRY_POLICY.BACKOFF_MS.at(-1)!
          console.warn(`[Relayer] Attempt ${attempt + 1} failed, retrying in ${backoffMs}ms...`, e?.message)
          await sleep(backoffMs)
        }
      }
    }

    // All attempts failed - throw error
    throw new Error(
      `Relay failed after ${RELAY_RETRY_POLICY.MAX_ATTEMPTS} attempts: ${lastError?.message || 'Unknown error'}`
    )
  }

  /**
   * Submit report with automatic retry tracking in database
   * This method should be used instead of directly calling submitReportVote
   * for database-backed retry logic
   */
  static async submitReportVoteWithRetry(
    reportId: string,
    targetAddress: string,
    reportHash: `0x${string}`,
    isScam: boolean
  ) {
    const { prisma } = await import('@/lib/prisma')

    // Get current report state
    const report = await prisma.threatReport.findUnique({
      where: { id: reportId },
    })

    if (!report) {
      throw new Error('Report not found')
    }

    if (report.deadLetter) {
      throw new Error('Report is marked as dead letter - will not retry')
    }

    // Increment attempt count
    const attempt = (report.relayAttempts || 0) + 1

    try {
      // Submit vote with retry policy
      const result = await this.submitReportVote(targetAddress, reportHash, isScam)

      // Update report on success
      await prisma.threatReport.update({
        where: { id: reportId },
        data: {
          onchainStatus: 'SUBMITTED',
          localStatus: 'SYNCED',
          onchainTxHash: result.txHash,
          blockNumber: result.blockNumber,
          chainId: result.chainId,
          contractAddress: result.contractAddress,
          relayedAt: new Date(),
          relayError: null,
          relayAttempts: attempt,
        },
      })

      return result
    } catch (e: any) {
      // Check if max attempts reached
      if (attempt >= RELAY_RETRY_POLICY.MAX_ATTEMPTS) {
        // Mark as dead letter
        await prisma.threatReport.update({
          where: { id: reportId },
          data: {
            localStatus: 'RELAY_FAILED',
            relayError: e?.message || 'relay failed',
            relayAttempts: attempt,
            deadLetter: true,
          },
        })

        throw new Error(
          `Report marked as dead letter after ${RELAY_RETRY_POLICY.MAX_ATTEMPTS} failed attempts: ${e?.message}`
        )
      } else {
        // Schedule next retry with exponential backoff
        const backoffMs = RELAY_RETRY_POLICY.BACKOFF_MS[attempt - 1] || RELAY_RETRY_POLICY.BACKOFF_MS.at(-1)!
        const nextRelayAt = new Date(Date.now() + backoffMs)

        await prisma.threatReport.update({
          where: { id: reportId },
          data: {
            localStatus: 'QUEUED',
            relayError: e?.message || 'relay failed',
            relayAttempts: attempt,
            nextRelayAt,
          },
        })

        throw e
      }
    }
  }
}
