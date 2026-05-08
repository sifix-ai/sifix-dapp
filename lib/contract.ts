/**
 * SIFIX Smart Contract Integration
 * Interact with on-chain reputation system
 */

import { createPublicClient, createWalletClient, http, parseEther, formatUnits, type Address } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { defineChain } from "viem"

// 0G Newton Testnet
const zgChain = defineChain({
  id: 16602,
  name: "0G Newton Testnet",
  network: "0g-galileo-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "A0GI",
    symbol: "A0GI"
  },
  rpcUrls: {
    default: {
      http: ["https://evmrpc-testnet.0g.ai"]
    },
    public: {
      http: ["https://evmrpc-testnet.0g.ai"]
    }
  },
  blockExplorers: {
    default: {
      name: "0G Explorer",
      url: "https://chainscan-galileo.0g.ai"
    }
  }
})

// Contract address
const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_SIFIX_CONTRACT ||
  "0x544a39149d5169E4e1bDf7F8492804224CB70152") as Address

// Contract ABI (simplified)
const CONTRACT_ABI = [
  {
    inputs: [
      { name: "target", type: "address" },
      { name: "severity", type: "uint8" },
      { name: "evidenceHash", type: "string" }
    ],
    name: "reportThreat",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "target", type: "address" }],
    name: "getReputation",
    outputs: [
      { name: "score", type: "uint256" },
      { name: "reportCount", type: "uint256" },
      { name: "lastUpdate", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "target", type: "address" }],
    name: "getReports",
    outputs: [
      {
        components: [
          { name: "reporter", type: "address" },
          { name: "severity", type: "uint8" },
          { name: "evidenceHash", type: "string" },
          { name: "timestamp", type: "uint256" }
        ],
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const

// Create public client for reading
const publicClient = createPublicClient({
  chain: zgChain,
  transport: http()
})

/**
 * Get address reputation from contract
 */
export async function getAddressReputation(address: Address): Promise<{
  score: number
  reportCount: number
  lastUpdate: Date | null
}> {
  try {
    const result = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getReputation",
      args: [address]
    })

    return {
      score: Number(result[0]),
      reportCount: Number(result[1]),
      lastUpdate: result[2] > 0 ? new Date(Number(result[2]) * 1000) : null
    }
  } catch (error) {
    console.error("[Contract] Get reputation failed:", error)
    return {
      score: 0,
      reportCount: 0,
      lastUpdate: null
    }
  }
}

/**
 * Report threat to contract
 */
export async function reportThreatToContract(
  targetAddress: Address,
  severity: number, // 0=LOW, 1=MEDIUM, 2=HIGH, 3=CRITICAL
  evidenceHash: string
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    // Check if private key is available
    const privateKey = process.env.PRIVATE_KEY
    if (!privateKey) {
      console.warn("[Contract] No private key configured, skipping on-chain report")
      return {
        success: false,
        error: "No private key configured"
      }
    }

    // Create wallet client
    const account = privateKeyToAccount(privateKey as `0x${string}`)
    const walletClient = createWalletClient({
      account,
      chain: zgChain,
      transport: http()
    })

    // Send transaction
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "reportThreat",
      args: [targetAddress, severity, evidenceHash]
    })

    console.log("[Contract] Threat reported:", hash)

    return {
      success: true,
      txHash: hash
    }
  } catch (error) {
    console.error("[Contract] Report threat failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Get threat reports for address
 */
export async function getThreatReports(address: Address): Promise<
  Array<{
    reporter: Address
    severity: number
    evidenceHash: string
    timestamp: Date
  }>
> {
  try {
    const result = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "getReports",
      args: [address]
    })

    return result.map((report) => ({
      reporter: report.reporter,
      severity: report.severity,
      evidenceHash: report.evidenceHash,
      timestamp: new Date(Number(report.timestamp) * 1000)
    }))
  } catch (error) {
    console.error("[Contract] Get reports failed:", error)
    return []
  }
}

/**
 * Map severity string to number
 */
export function severityToNumber(
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
): number {
  const map = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 }
  return map[severity]
}

/**
 * Estimate gas for reporting threat
 */
export async function estimateGasForReport(
  targetAddress: Address,
  severity: number,
  evidenceHash: string
): Promise<{ gasEstimate: bigint; gasCost: string; error?: string }> {
  try {
    const privateKey = process.env.PRIVATE_KEY
    if (!privateKey) {
      return {
        gasEstimate: 0n,
        gasCost: "0",
        error: "No private key configured for gas estimation"
      }
    }

    const account = privateKeyToAccount(privateKey as `0x${string}`)
    const walletClient = createWalletClient({
      account,
      chain: zgChain,
      transport: http()
    })

    // Estimate gas for the transaction
    const gasEstimate = await walletClient.estimateContractGas({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "reportThreat",
      args: [targetAddress, severity, evidenceHash]
    })

    // Get current gas price
    const gasPrice = await publicClient.getGasPrice()

    // Calculate total gas cost in A0GI
    const gasCost = gasEstimate * gasPrice
    const gasCostFormatted = parseFloat(formatUnits(gasCost, 18)).toFixed(6)

    return {
      gasEstimate,
      gasCost: gasCostFormatted
    }
  } catch (error) {
    console.error("[Contract] Gas estimation failed:", error)
    return {
      gasEstimate: 0n,
      gasCost: "0",
      error: error instanceof Error ? error.message : "Gas estimation failed"
    }
  }
}
