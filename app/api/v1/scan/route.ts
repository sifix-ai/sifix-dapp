import { NextRequest, NextResponse } from "next/server"
import { getAddressReputation } from "@/lib/contract"
import { prisma } from "@/lib/prisma"
import { isValidEthereumAddress } from "@/lib/address-validation"
import { verifyApiAuth } from "@/lib/extension-auth"

export async function POST(request: NextRequest) {
  // Auth check
  const auth = await verifyApiAuth()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { address } = body

    if (!address || !isValidEthereumAddress(address)) {
      return NextResponse.json(
        { error: "Invalid Ethereum address format" },
        { status: 400 }
      )
    }

    // Get on-chain reputation
    const reputation = await getAddressReputation(address as `0x${string}`)

    // Get or create Address record
    let addressRecord = await prisma.address.findUnique({
      where: { address }
    })

    if (!addressRecord) {
      addressRecord = await prisma.address.create({
        data: {
          address,
          riskScore: reputation.score,
          riskLevel: reputation.score >= 80 ? "CRITICAL" : reputation.score >= 60 ? "HIGH" : reputation.score >= 40 ? "MEDIUM" : "LOW"
        }
      })
    }

    // Get threat count from database
    const threatCount = await prisma.threatReport.count({
      where: { addressId: addressRecord.id }
    })

    // Calculate risk level based on reputation score
    let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
    const score = reputation.score

    if (score >= 80) riskLevel = "CRITICAL"
    else if (score >= 60) riskLevel = "HIGH"
    else if (score >= 40) riskLevel = "MEDIUM"
    else riskLevel = "LOW"

    return NextResponse.json({
      address,
      riskLevel,
      riskScore: score,
      threatCount,
      lastScan: new Date().toISOString(),
      analysis: {
        reasoning: `Address has ${reputation.reportCount} on-chain reports with reputation score ${score}/100`,
        recommendation: score >= 60 ? "BLOCK" : score >= 40 ? "CAUTION" : "PROCEED"
      }
    })
  } catch (error) {
    console.error("Scan address error:", error)
    return NextResponse.json(
      { error: "Failed to scan address" },
      { status: 500 }
    )
  }
}
