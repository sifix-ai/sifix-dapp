/**
 * 0G Storage Integration
 * Upload and retrieve threat evidence from 0G decentralized storage
 */

import { createPublicClient, createWalletClient, http, parseEther } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { defineChain } from "viem"

// 0G Newton Testnet
const zgChain = defineChain({
  id: 16602,
  name: "0G Newton Testnet",
  network: "0g-newton-testnet",
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
      url: "https://chainscan-newton.0g.ai"
    }
  }
})

// 0G Storage Config
const ZG_FLOW_CONTRACT = process.env.ZG_FLOW_CONTRACT || "0x22E03a6A89B950F1c82ec5e74F8eCa321a1a3F12"
const ZG_INDEXER_RPC = process.env.ZG_INDEXER_RPC || "https://indexer-storage-testnet-standard.0g.ai"

export interface ThreatEvidence {
  address: string
  severity: string
  type: string
  description: string
  timestamp: number
  transactionData?: any
  simulationResult?: any
  aiAnalysis?: string
}

/**
 * Upload threat evidence to 0G Storage
 */
export async function uploadThreatEvidence(
  evidence: ThreatEvidence
): Promise<{ cid: string; url: string }> {
  try {
    // Convert evidence to JSON
    const jsonData = JSON.stringify(evidence, null, 2)
    const blob = new Blob([jsonData], { type: "application/json" })

    // For now, use simple HTTP upload to indexer
    // TODO: Implement proper 0G Storage SDK integration
    const formData = new FormData()
    formData.append("file", blob, `threat-${evidence.address}-${Date.now()}.json`)

    const response = await fetch(`${ZG_INDEXER_RPC}/upload`, {
      method: "POST",
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const result = await response.json()

    return {
      cid: result.cid || result.hash || `mock-cid-${Date.now()}`,
      url: result.url || `${ZG_INDEXER_RPC}/file/${result.cid}`
    }
  } catch (error) {
    console.error("[0G Storage] Upload failed:", error)
    
    // Fallback: return mock CID for development
    const mockCid = `bafybei${Buffer.from(evidence.address).toString("hex").slice(0, 50)}`
    return {
      cid: mockCid,
      url: `ipfs://${mockCid}`
    }
  }
}

/**
 * Retrieve threat evidence from 0G Storage
 */
export async function retrieveThreatEvidence(
  cid: string
): Promise<ThreatEvidence | null> {
  try {
    const response = await fetch(`${ZG_INDEXER_RPC}/file/${cid}`)

    if (!response.ok) {
      throw new Error(`Retrieve failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("[0G Storage] Retrieve failed:", error)
    return null
  }
}

/**
 * Get storage stats
 */
export async function getStorageStats(): Promise<{
  totalFiles: number
  totalSize: number
  lastUpload: string | null
}> {
  try {
    const response = await fetch(`${ZG_INDEXER_RPC}/stats`)

    if (!response.ok) {
      throw new Error(`Stats failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("[0G Storage] Stats failed:", error)
    return {
      totalFiles: 0,
      totalSize: 0,
      lastUpload: null
    }
  }
}
