import { NextRequest, NextResponse } from "next/server"
import { SecurityAgent } from "@/lib/agent"
import type { Address, Hash } from "viem"

// Initialize SecurityAgent
const agent = new SecurityAgent({
  rpcUrl: process.env.NEXT_PUBLIC_ZG_RPC_URL || "https://evmrpc-testnet.0g.ai",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  zeroGStorageUrl: process.env.ZG_STORAGE_URL || ""
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { from, to, data, value } = body

    // Validate inputs
    if (!from || !to) {
      return NextResponse.json(
        { error: "Missing required fields: from, to" },
        { status: 400 }
      )
    }

    if (!from.startsWith("0x") || !to.startsWith("0x")) {
      return NextResponse.json(
        { error: "Invalid address format" },
        { status: 400 }
      )
    }

    // Analyze transaction
    console.log(`[API] Analyzing transaction: ${from} → ${to}`)
    
    const result = await agent.analyzeTransaction({
      from: from as Address,
      to: to as Address,
      data: data as Hash | undefined,
      value: value ? BigInt(value) : undefined
    })

    // Map risk score to risk level
    const riskScore = result.analysis.riskScore
    let riskLevel: "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
    
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
      reasoning: result.analysis.reasoning,
      threats: result.analysis.threats,
      recommendation: result.analysis.recommendation,
      simulation: {
        success: result.simulation.success,
        gasUsed: result.simulation.gasUsed.toString(),
        balanceChanges: result.simulation.balanceChanges.map(change => ({
          token: change.token,
          from: change.from,
          to: change.to,
          amount: change.amount.toString()
        })),
        revertReason: result.simulation.revertReason
      },
      threatIntel: result.threatIntel,
      timestamp: result.timestamp
    })
  } catch (error) {
    console.error("[API] Transaction analysis error:", error)
    return NextResponse.json(
      { 
        error: "Failed to analyze transaction",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
