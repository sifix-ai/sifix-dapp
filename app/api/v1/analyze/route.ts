import { NextRequest, NextResponse } from "next/server"
import { SecurityAgent } from "@sifix/agent"
import type { Address, Hash } from "viem"
import { prisma } from "@/lib/prisma"
import { verifyApiAuth } from "@/lib/extension-auth"
import { PrismaThreatIntel } from "@/lib/threat-intel"
import { isValidEthereumAddress } from "@/lib/address-validation"
import { shouldAutoReport, AUTO_REPORT_POLICY } from "@/lib/auto-report-policy"
import { ReportService } from "@/services/report-service"
import { validateAddressOnChain } from "@/lib/chain-validation"

// Singleton threat intel provider
const threatIntel = new PrismaThreatIntel()

// Singleton agent instances
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
      threatIntel,
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
      threatIntel,
    })
    await computeAgent.init()
  }
  return computeAgent
}

/**
 * Select agent based on user AI provider preferences
 * Priority: user settings > server compute config > default
 */
async function selectAgent(walletAddress?: string): Promise<{ agent: SecurityAgent; provider: string }> {
  let agent: SecurityAgent
  let provider: string = "default"

  if (walletAddress) {
    const userSettings = await prisma.userSettings.findUnique({
      where: { address: walletAddress.toLowerCase() },
    })

    if (userSettings && userSettings.aiProvider !== "default") {
      provider = userSettings.aiProvider

      if (userSettings.aiProvider === "0g-compute") {
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
          threatIntel,
        })
      } else {
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
          threatIntel,
        })
      }
    } else {
      if (process.env.COMPUTE_PROVIDER_ADDRESS) {
        agent = await getComputeAgent()
        provider = "0g-compute"
      } else {
        agent = getDefaultAgent()
      }
    }
  } else {
    if (process.env.COMPUTE_PROVIDER_ADDRESS) {
      agent = await getComputeAgent()
      provider = "0g-compute"
    } else {
      agent = getDefaultAgent()
    }
  }

  return { agent, provider }
}

/**
 * POST /api/v1/analyze
 * Unified endpoint for transaction and message signature analysis
 * 
 * Body: { from, to?, data, value, method?, typedData? }
 * 
 * Transaction analysis:
 *   - Requires: from, to, data, value
 *   - Optional: method (omitted for transactions)
 * 
 * Message signature analysis:
 *   - Requires: from, method, data (message content)
 *   - Optional: typedData (for EIP-712 signatures)
 */
export async function POST(request: NextRequest) {
  // Auth check
  const auth = await verifyApiAuth()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error || "Authentication required" }, { status: 401 })
  }

  const walletAddress = auth.walletAddress

  try {
    const body = await request.json()
    const { from, to, data, value, method, typedData } = body

    if (!from) {
      return NextResponse.json({ error: "Missing required field: from" }, { status: 400 })
    }

    if (!isValidEthereumAddress(from)) {
      return NextResponse.json({ error: "Invalid 'from' Ethereum address format" }, { status: 400 })
    }

    // Select agent based on user AI provider preference
    const { agent, provider } = await selectAgent(walletAddress)

    // Determine analysis type based on presence of method field
    if (method) {
      // Message signature analysis
      console.log(`[API] Analyzing message signature: ${from} (method: ${method}, wallet: ${walletAddress}, provider: ${provider})`)

      // Map method names from extension format to agent format
      let agentMethod: 'personalSign' | 'eth_signTypedData' = 'personalSign'
      if (method === 'personal_sign' || method === 'eth_sign') {
        agentMethod = 'personalSign'
      } else if (method === 'eth_signTypedData_v3' || method === 'eth_signTypedData_v4' || method === 'eth_signTypedData') {
        agentMethod = 'eth_signTypedData'
      }

      // Call message signature analysis
      const result = await (agent as any).analyzeMessageSignature({
        from: from as Address,
        method: agentMethod,
        message: data,
        typedData,
      })

      const riskScore = result.riskScore
      let riskLevel: string
      if (riskScore >= 80) riskLevel = "CRITICAL"
      else if (riskScore >= 60) riskLevel = "HIGH"
      else if (riskScore >= 40) riskLevel = "MEDIUM"
      else if (riskScore >= 20) riskLevel = "LOW"
      else riskLevel = "SAFE"

      return NextResponse.json({
        success: true,
        analysisType: "signature",
        method,
        riskLevel,
        riskScore,
        confidence: result.confidence,
        recommendation: result.recommendation || (riskScore >= 60 ? "BLOCK" : riskScore >= 40 ? "WARN" : "PROCEED"),
        reasoning: result.reasoning,
        threats: result.threats || [],
        provider: result.provider || provider,
        timestamp: new Date().toISOString(),
      })
    } else {
      // Transaction analysis
      if (!to) {
        return NextResponse.json({ error: "Missing required field: to (or provide 'method' for signature analysis)" }, { status: 400 })
      }

      if (!isValidEthereumAddress(to)) {
        return NextResponse.json({ error: "Invalid 'to' Ethereum address format" }, { status: 400 })
      }

      console.log(`[API] Analyzing transaction: ${from} -> ${to} (wallet: ${walletAddress}, provider: ${provider})`)

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

      // Generate storage URL if we have a hash but no explorer URL
      let storageUrl = result.storageExplorer || null
      if (!storageUrl && result.storageRootHash) {
        const explorerBaseUrl = process.env.STORAGE_EXPLORER_URL || "https://storage-testnet.0g.ai"
        storageUrl = `${explorerBaseUrl}/file/${result.storageRootHash}`
      }

      const chainCheck = await validateAddressOnChain(to, '0g-galileo')
      const autoReportEligible = shouldAutoReport({
        riskScore,
        confidence: Math.round(result.analysis.confidence || 0),
        isAddress: true,
        existsOnChain: chainCheck.existsOnChain,
      })

      let autoReported = false
      if (autoReportEligible) {
        try {
          await ReportService.create({
            address: to.toLowerCase(),
            reporterAddress: AUTO_REPORT_POLICY.systemReporter,
            threatType: 'AUTO_DETECTED_SCAM',
            severity: riskScore,
            evidenceHash: result.storageRootHash || `auto-${Date.now()}`,
            explanation: `[AUTO] ${result.analysis.reasoning || 'High risk detected by analyzer'}`,
            transactionHash: undefined,
            confidence: Math.round(result.analysis.confidence || 0),
            simulationData: JSON.stringify({
              source: 'analyze-route',
              recommendation: result.analysis.recommendation,
              threats: result.analysis.threats || [],
              storageHash: result.storageRootHash || null,
            }),
          })
          autoReported = true
        } catch {
          autoReported = false
        }
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
        autoReported,
        provider: result.computeProvider || provider,
        simulation: {
          success: result.simulation.success,
          gasUsed: result.simulation.gasUsed.toString(),
          balanceChanges: result.simulation.balanceChanges.map((change: any) => ({
            token: change.token,
            from: change.from,
            to: change.to,
            amount: change.amount.toString(),
          })),
          revertReason: result.simulation.revertReason,
        },
        threatIntel: result.threatIntel,
        timestamp: result.timestamp,
        // 0G Storage proof
        storageHash: result.storageRootHash || null,
        storageExplorer: storageUrl,
        storageDownload: result.storageRootHash ? `/api/v1/storage/${result.storageRootHash}/download` : null,
      })
    }
  } catch (error) {
    console.error("[API] Analysis error:", error)
    return NextResponse.json(
      {
        error: "Analysis failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
