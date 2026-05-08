import { NextRequest, NextResponse } from "next/server"
import { getAddressReputation, getThreatReports } from "@/lib/contract"
import { isValidEthereumAddress } from "@/lib/address-validation"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params

    if (!address || !isValidEthereumAddress(address)) {
      return NextResponse.json(
        { error: "Invalid Ethereum address format" },
        { status: 400 }
      )
    }

    // Query on-chain reputation contract
    const reputation = await getAddressReputation(address as `0x${string}`)
    const reports = await getThreatReports(address as `0x${string}`)

    return NextResponse.json({
      address,
      score: reputation.score,
      reportCount: reputation.reportCount,
      lastUpdate: reputation.lastUpdate?.toISOString() || null,
      reports: reports.map(r => ({
        reporter: r.reporter,
        severity: r.severity,
        evidenceHash: r.evidenceHash,
        timestamp: r.timestamp.toISOString()
      }))
    })
  } catch (error) {
    console.error("Get reputation error:", error)
    return NextResponse.json(
      { error: "Failed to get reputation" },
      { status: 500 }
    )
  }
}
