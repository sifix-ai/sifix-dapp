import { NextRequest, NextResponse } from "next/server"
import { SecurityAgent } from "@sifix/agent"
import type { Address, Hash } from "viem"
import { prisma } from "@/lib/prisma"

// Singleton agent instances (reused across requests)
let defaultAgent: SecurityAgent | null = null
let computeAgent: SecurityAgent | null = null

/**
 * Get or create the default agent (server AI config)
 */
function getDefaultAgent(): SecurityAgent {
  if (!defaultAgent) {
    defaultAgent = new SecurityAgent({
      rpcUrl: process.env.NEXT_PUBLIC_ZG_RPC_URL || "https://evmrpc-testnet.0g.ai",
      aiProvider: {
        apiKey: process.env.AI_API_KEY || "",
        baseURL: process.env.AI_BASE_URL || "https://api.openai.com/v1",
        model: process.env.AI_MODEL || "gpt-4-turbo-preview",
      },
      storage: {
        indexerUrl: process.env.ZG_INDEXER_URL || "https://indexer-storage-testnet-turbo.0g.ai",
        privateKey: process.env.STORAGE_PRIVATE_KEY,
        mockMode: process.env.STORAGE_MOCK_MODE === "true",
      },
    })
  }
  return defaultAgent
}

/**
 * Get or create the 0G Compute agent (decentralized inference)
 */
async function getComputeAgent(): Promise<SecurityAgent> {
  if (!computeAgent) {
    computeAgent = new SecurityAgent({
      rpcUrl: process.env.NEXT_PUBLIC_ZG_RPC_URL || "https://evmrpc-testnet.0g.ai",
      compute: {
        privateKey: process.env.COMPUTE_PRIVATE_KEY || process.env.STORAGE_PRIVATE_KEY || "",
        providerAddress: process.env.COMPUTE_PROVIDER_ADDRESS || "",
      },
      storage: {
        indexerUrl: process.env.ZG_INDEXER_URL || "https://indexer-storage-testnet-turbo.0g.ai",
        privateKey: process.env.STORAGE_PRIVATE_KEY,
        mockMode: process.env.STORAGE_MOCK_MODE === "true",
      },
    })
    // Initialize broker (acknowledge provider, fetch model)
    await computeAgent.init()
  }
  return computeAgent
}

/**
 * POST /api/v1/extension/analyze
 * Extension-facing analyze endpoint
 * 
 * AI provider priority:
 * 1. User BYOAI → 0g-compute → user wallet pays
 * 2. User BYOAI → openai/groq/custom → user API key
 * 3. Server default (0G Compute if configured, else AI_API_KEY)
 * 
 * Body: { from, to, data, value, walletAddress }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { from, to, data, value, walletAddress } = body

    if (!from || !to) {
      return NextResponse.json({ error: "Missing required fields: from, to" }, { status: 400 })
    }

    // Determine which agent to use
    let agent: SecurityAgent
    let provider: string = "default"

    if (walletAddress) {
      const userSettings = await prisma.userSettings.findUnique({
        where: { address: walletAddress.toLowerCase() },
      })

      if (userSettings && userSettings.aiProvider !== "default") {
        provider = userSettings.aiProvider

        if (userSettings.aiProvider === "0g-compute") {
          // User wants 0G Compute — use server's compute agent
          agent = await getComputeAgent()
        } else if (userSettings.aiProvider === "ollama") {
          agent = new SecurityAgent({
            rpcUrl: process.env.NEXT_PUBLIC_ZG_RPC_URL || "https://evmrpc-testnet.0g.ai",
            aiProvider: {
              apiKey: "ollama",
              baseURL: userSettings.aiBaseUrl || "http://localhost:11434/v1",
              model: userSettings.aiModel || "llama3.2",
            },
            storage: {
              indexerUrl: process.env.ZG_INDEXER_URL || "https://indexer-storage-testnet-turbo.0g.ai",
              privateKey: process.env.STORAGE_PRIVATE_KEY,
              mockMode: process.env.STORAGE_MOCK_MODE === "true",
            },
          })
        } else {
          // OpenAI, Groq, Custom
          agent = new SecurityAgent({
            rpcUrl: process.env.NEXT_PUBLIC_ZG_RPC_URL || "https://evmrpc-testnet.0g.ai",
            aiProvider: {
              apiKey: userSettings.aiApiKey || "",
              baseURL: userSettings.aiBaseUrl,
              model: userSettings.aiModel,
            },
            storage: {
              indexerUrl: process.env.ZG_INDEXER_URL || "https://indexer-storage-testnet-turbo.0g.ai",
              privateKey: process.env.STORAGE_PRIVATE_KEY,
              mockMode: process.env.STORAGE_MOCK_MODE === "true",
            },
          })
        }
      } else {
        // User has default — use server's 0G Compute if configured, else fallback
        if (process.env.COMPUTE_PROVIDER_ADDRESS) {
          agent = await getComputeAgent()
          provider = "0g-compute"
        } else {
          agent = getDefaultAgent()
        }
      }
    } else {
      // No wallet — use server default
      if (process.env.COMPUTE_PROVIDER_ADDRESS) {
        agent = await getComputeAgent()
        provider = "0g-compute"
      } else {
        agent = getDefaultAgent()
      }
    }

    console.log(`[Extension API] Analyzing: ${from} -> ${to} (provider: ${provider})`)

    const result = await agent.analyzeTransaction({
      from: from as Address,
      to: to as Address,
      data: data as Hash | undefined,
      value: value ? BigInt(value) : undefined,
    })

    const riskScore = result.analysis.riskScore
    let riskLevel: string
    if (riskScore >= 80) riskLevel = "CRITICAL"
    else if (riskScore >= 60) riskLevel = "HIGH"
    else if (riskScore >= 40) riskLevel = "MEDIUM"
    else if (riskScore >= 20) riskLevel = "LOW"
    else riskLevel = "SAFE"

    return NextResponse.json({
      success: true,
      riskLevel,
      riskScore,
      confidence: result.analysis.confidence,
      recommendation: riskScore >= 60 ? "BLOCK" : riskScore >= 40 ? "WARN" : "PROCEED",
      explanation: result.analysis.reasoning,
      detectedThreats: result.analysis.threats || [],
      provider: result.computeProvider || provider,
      // 0G Storage proof
      storageHash: result.storageRootHash || null,
      storageUrl: result.storageExplorer || null,
    })
  } catch (error) {
    console.error("Extension analyze error:", error)
    return NextResponse.json(
      { error: "Analysis failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
