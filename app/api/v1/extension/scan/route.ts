import { NextRequest, NextResponse } from "next/server"
import { getAddressReputation } from "@/lib/contract"
import { prisma } from "@/lib/prisma"
import { verifyExtensionAuth } from "@/lib/extension-auth"

/**
 * POST /api/v1/extension/scan
 * Protected: Requires Bearer token from extension auth
 * Body: { address: string }
 */
export async function POST(request: NextRequest) {
  // Auth check
  const auth = await verifyExtensionAuth()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { address } = body

    if (!address || !address.startsWith("0x")) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 })
    }

    // Get on-chain reputation
    const reputation = await getAddressReputation(address as `0x${string}`)

    // Get from database
    let addressRecord = await prisma.address.findUnique({ where: { address } })

    if (!addressRecord) {
      addressRecord = await prisma.address.create({
        data: {
          address,
          riskScore: reputation.score,
          riskLevel: reputation.score >= 80 ? "CRITICAL" : reputation.score >= 60 ? "HIGH" : reputation.score >= 40 ? "MEDIUM" : "LOW"
        }
      })
    }

    const threatCount = await prisma.threatReport.count({
      where: { addressId: addressRecord.id }
    })

    // Get tags from community
    const tags = await prisma.threatReport.findMany({
      where: { addressId: addressRecord.id, status: "VERIFIED" },
      select: { threatType: true, explanation: true, severity: true },
      take: 10
    })

    const score = reputation.score
    let riskLevel: string
    if (score >= 80) riskLevel = "CRITICAL"
    else if (score >= 60) riskLevel = "HIGH"
    else if (score >= 40) riskLevel = "MEDIUM"
    else if (score >= 20) riskLevel = "LOW"
    else riskLevel = "SAFE"

    return NextResponse.json({
      address,
      inputType: "address",
      riskScore: score,
      riskLevel,
      isVerified: reputation.reportCount > 0,
      reportCount: threatCount,
      tags: tags.map(t => ({
        tag: t.threatType,
        label: t.explanation,
        severity: t.severity
      }))
    })
  } catch (error) {
    console.error("Extension scan error:", error)
    return NextResponse.json({ error: "Scan failed" }, { status: 500 })
  }
}
