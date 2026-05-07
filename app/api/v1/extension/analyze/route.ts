import { NextRequest, NextResponse } from "next/server"
import { SecurityAgent } from "@sifix/agent"
import type { Address, Hash } from "viem"
import { prisma } from "@/lib/prisma"

/**
 * POST /api/v1/extension/analyze
 * Extension-facing analyze endpoint using user's BYOAI config
 * Body: { from, to, data, value, walletAddress }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { from, to, data, value, walletAddress } = body

    if (!from || !to) {
      return NextResponse.json({ error: "Missing required fields: from, to" }, { status: 400 })
    }

    // Check user's BYOAI settings
    let aiConfig: any = {
      apiKey: process.env.AI_API_KEY,
      baseURL: process.env.AI_BASE_URL || "https://api.openai.com/v1",
      model: process.env.AI_MODEL || "gpt-4-turbo-preview"
    }

    if (walletAddress) {
      const userSettings = await prisma.userSettings.findUnique({
        where: { address: walletAddress.toLowerCase() }
      })

      if (userSettings && userSettings.aiProvider !== "default") {
        // User has custom AI provider
        if (userSettings.aiProvider === "0g-compute") {
          // 0G Compute: use user's wallet, charges their balance
          aiConfig = {
            apiKey: userSettings.aiApiKey || "",
            baseURL: "https://compute-testnet.0g.ai/v1",
            model: userSettings.aiModel || "0g-llama-3.3-70b"
          }
        } else if (userSettings.aiProvider === "ollama") {
          aiConfig = {
            apiKey: "ollama",
            baseURL: userSettings.aiBaseUrl || "http://localhost:11434/v1",
            model: userSettings.aiModel || "llama3.2"
          }
        } else {
          // OpenAI, Groq, Custom
          aiConfig = {
            apiKey: userSettings.aiApiKey || "",
            baseURL: userSettings.aiBaseUrl || aiConfig.baseURL,
            model: userSettings.aiModel || aiConfig.model
          }
        }
      }
    }

    // Create agent with resolved AI config
    const agent = new SecurityAgent({
      rpcUrl: process.env.NEXT_PUBLIC_ZG_RPC_URL || "https://evmrpc-testnet.0g.ai",
      aiProvider: aiConfig,
      storage: {
        indexerUrl: process.env.ZG_INDEXER_URL || "https://indexer-storage-testnet-turbo.0g.ai",
        privateKey: process.env.STORAGE_PRIVATE_KEY,
        mockMode: process.env.STORAGE_MOCK_MODE === "true"
      }
    })

    console.log("[Extension API] Analyzing: " + from + " -> " + to + " (provider: " + (walletAddress ? "user" : "default") + ")")

    const result = await agent.analyzeTransaction({
      from: from as Address,
      to: to as Address,
      data: data as Hash | undefined,
      value: value ? BigInt(value) : undefined
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
      storageHash: result.storageHash || null,
      storageUrl: result.storageHash
        ? "https://chainscan-newton.0g.ai/tx/" + result.storageHash
        : null
    })
  } catch (error) {
    console.error("Extension analyze error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
