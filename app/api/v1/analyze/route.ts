import { NextRequest, NextResponse } from "next/server"
import { SecurityAgent } from "@sifix/agent"
import type { Address, Hash } from "viem"
import { PrismaThreatIntel } from "@/lib/threat-intel"
import { isValidEthereumAddress } from "@/lib/address-validation"
import { verifyApiAuth } from "@/lib/extension-auth"

// Singleton threat intel provider
const threatIntel = new PrismaThreatIntel()

// Singleton agent — 0G Compute if configured, else fallback to AI_API_KEY
let agentInstance: SecurityAgent | null = null

async function getAgent(): Promise<SecurityAgent> {
  if (!agentInstance) {
    const hasCompute = !!process.env.COMPUTE_PROVIDER_ADDRESS

    if (hasCompute) {
      agentInstance = new SecurityAgent({
        rpcUrl: process.env.NEXT_PUBLIC_ZG_RPC_URL || "https://evmrpc-testnet.0g.ai",
        compute: {
          privateKey: process.env.COMPUTE_PRIVATE_KEY || process.env.STORAGE_PRIVATE_KEY || "",
          providerAddress: process.env.COMPUTE_PROVIDER_ADDRESS!,
        },
        storage: {
          indexerUrl: process.env.ZG_INDEXER_URL || "https://indexer-storage-testnet-turbo.0g.ai",
          privateKey: process.env.STORAGE_PRIVATE_KEY,
          mockMode: process.env.STORAGE_MOCK_MODE === "true",
        },
        threatIntel,
      })
      await agentInstance.init()
      console.log("[API] Agent initialized with 0G Compute + Threat Intel")
    } else {
      agentInstance = new SecurityAgent({
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
        threatIntel,
      })
      console.log("[API] Agent initialized with fallback AI + Threat Intel")
    }
  }
  return agentInstance
}

export async function POST(request: NextRequest) {
  try {
    // Auth guard
    const auth = await verifyApiAuth()

    if (!auth.authorized) {
      return NextResponse.json(
        {
          error: auth.error || "Authentication required",
        },
        { status: 401 }
      )
    }

    const body = await request.json()

    const {
      // transaction fields
      from,
      to,
      data,
      value,

      // signature fields
      address,
      message,
      signature,
      type,
    } = body

    const agent = await getAgent()

    /**
     * =========================================================
     * SIGNATURE ANALYSIS
     * =========================================================
     */
    const isSignatureRequest =
      !!message || type === "personal_sign" || !!signature

    if (isSignatureRequest) {
      const signerAddress = address || from

      if (!signerAddress || !message) {
        return NextResponse.json(
          {
            error:
              "Missing required fields for signature analysis: address/message",
          },
          { status: 400 }
        )
      }

      if (!isValidEthereumAddress(signerAddress)) {
        return NextResponse.json(
          {
            error: "Invalid Ethereum address format",
          },
          { status: 400 }
        )
      }

      console.log(
        `[API] Analyzing signature request from ${signerAddress}`
      )

      /**
       * Example analyzer call
       * You can replace this with:
       * agent.analyzeSignature(...)
       */
      const result = await agent.analyzeSignature({
        address: signerAddress as Address,
        message,
        signature,
        type: type || "personal_sign",
      })

      const riskScore = result.analysis.riskScore

      let riskLevel:
        | "SAFE"
        | "LOW"
        | "MEDIUM"
        | "HIGH"
        | "CRITICAL"

      if (riskScore >= 80) riskLevel = "CRITICAL"
      else if (riskScore >= 60) riskLevel = "HIGH"
      else if (riskScore >= 40) riskLevel = "MEDIUM"
      else if (riskScore >= 20) riskLevel = "LOW"
      else riskLevel = "SAFE"

      let storageUrl = result.storageExplorer || null

      if (!storageUrl && result.storageRootHash) {
        const explorerBaseUrl =
          process.env.STORAGE_EXPLORER_URL ||
          "https://storage-testnet.0g.ai"

        storageUrl = `${explorerBaseUrl}/file/${result.storageRootHash}`
      }

      return NextResponse.json({
        success: true,

        analysisType: "signature",

        signatureType: type || "personal_sign",

        riskLevel,
        riskScore,

        confidence: result.analysis.confidence,
        reasoning: result.analysis.reasoning,
        threats: result.analysis.threats,
        recommendation: result.analysis.recommendation,

        provider: result.computeProvider,

        signatureAnalysis: {
          address: signerAddress,
          hasSignature: !!signature,
          messagePreview:
            typeof message === "string"
              ? message.slice(0, 200)
              : null,
        },

        threatIntel: result.threatIntel,
        timestamp: result.timestamp,

        storageHash: result.storageRootHash || null,
        storageExplorer: storageUrl,

        storageDownload: result.storageRootHash
          ? `/api/v1/storage/${result.storageRootHash}/download`
          : null,
      })
    }

    /**
     * =========================================================
     * TRANSACTION ANALYSIS
     * =========================================================
     */
    if (!from || !to) {
      return NextResponse.json(
        {
          error:
            "Missing required fields for transaction analysis: from, to",
        },
        { status: 400 }
      )
    }

    if (
      !isValidEthereumAddress(from) ||
      !isValidEthereumAddress(to)
    ) {
      return NextResponse.json(
        {
          error: "Invalid Ethereum address format",
        },
        { status: 400 }
      )
    }

    console.log(`[API] Analyzing transaction: ${from} → ${to}`)

    const result = await agent.analyzeTransaction({
      from: from as Address,
      to: to as Address,
      data: data as Hash | undefined,
      value: value ? BigInt(value) : undefined,
    })

    const riskScore = result.analysis.riskScore

    let riskLevel:
      | "SAFE"
      | "LOW"
      | "MEDIUM"
      | "HIGH"
      | "CRITICAL"

    if (riskScore >= 80) riskLevel = "CRITICAL"
    else if (riskScore >= 60) riskLevel = "HIGH"
    else if (riskScore >= 40) riskLevel = "MEDIUM"
    else if (riskScore >= 20) riskLevel = "LOW"
    else riskLevel = "SAFE"

    // Generate storage URL if we have a hash but no explorer URL
    let storageUrl = result.storageExplorer || null

    if (!storageUrl && result.storageRootHash) {
      const explorerBaseUrl =
        process.env.STORAGE_EXPLORER_URL ||
        "https://storage-testnet.0g.ai"

      storageUrl = `${explorerBaseUrl}/file/${result.storageRootHash}`
    }

    return NextResponse.json({
      success: true,

      analysisType: "transaction",

      riskLevel,
      riskScore,

      confidence: result.analysis.confidence,
      reasoning: result.analysis.reasoning,
      threats: result.analysis.threats,
      recommendation: result.analysis.recommendation,

      provider: result.computeProvider,

      simulation: {
        success: result.simulation.success,
        gasUsed: result.simulation.gasUsed.toString(),

        balanceChanges:
          result.simulation.balanceChanges.map(
            (change: any) => ({
              token: change.token,
              from: change.from,
              to: change.to,
              amount: change.amount.toString(),
            })
          ),

        revertReason: result.simulation.revertReason,
      },

      threatIntel: result.threatIntel,
      timestamp: result.timestamp,

      // 0G Storage proof
      storageHash: result.storageRootHash || null,
      storageExplorer: storageUrl,

      storageDownload: result.storageRootHash
        ? `/api/v1/storage/${result.storageRootHash}/download`
        : null,
    })
  } catch (error) {
    console.error("[API] Analysis error:", error)

    return NextResponse.json(
      {
        error: "Failed to analyze request",
      },
      { status: 500 }
    )
  }
}