import { NextRequest, NextResponse } from "next/server"
import { getAddressReputation } from "@/lib/contract"
import { prisma } from "@/lib/prisma"
import { isValidEthereumAddress } from "@/lib/address-validation"
import { verifyApiAuth } from "@/lib/extension-auth"

/**
 * Unified scan endpoint — POST /api/v1/scan
 *
 * Accepts { address } via POST body or GET ?address=...
 * Returns combined reputation + DB data:
 *   address, riskScore, riskLevel, tags, reportCount, threatCount
 *
 * Auth: Requires Bearer token (extension auth) when called via
 *       /api/v1/extension/scan (handled by the proxy route).
 *       Direct /api/v1/scan calls also enforce auth for consistency.
 */
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

    return await performScan(address)
  } catch (error) {
    console.error("Scan address error:", error)
    return NextResponse.json(
      { error: "Failed to scan address" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/v1/scan?address=0x...
 */
export async function GET(request: NextRequest) {
  const auth = await verifyApiAuth()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address || !isValidEthereumAddress(address)) {
      return NextResponse.json(
        { error: "Invalid Ethereum address format" },
        { status: 400 }
      )
    }

    return await performScan(address)
  } catch (error) {
    console.error("Scan address error:", error)
    return NextResponse.json(
      { error: "Failed to scan address" },
      { status: 500 }
    )
  }
}

/**
 * Shared scan logic used by both GET and POST handlers.
 */
async function performScan(address: string) {
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
        riskLevel:
          reputation.score >= 80
            ? "CRITICAL"
            : reputation.score >= 60
              ? "HIGH"
              : reputation.score >= 40
                ? "MEDIUM"
                : "LOW"
      }
    })
  }

  // Threat count from database
  const threatCount = await prisma.threatReport.count({
    where: { addressId: addressRecord.id }
  })

  // Report count (all reports, regardless of status)
  const reportCount = await prisma.threatReport.count({
    where: { addressId: addressRecord.id }
  })

  // Tags from AddressTag table
  const addressTags = await prisma.addressTag.findMany({
    where: { addressId: addressRecord.id },
    select: { tag: true, upvotes: true, downvotes: true, taggedBy: true },
    orderBy: { upvotes: "desc" },
    take: 20
  })

  // Verified threat tags (from ThreatReport, status = VERIFIED)
  const verifiedThreatTags = await prisma.threatReport.findMany({
    where: { addressId: addressRecord.id, status: "VERIFIED" },
    select: { threatType: true, explanation: true, severity: true },
    take: 10
  })

  // Calculate risk level based on reputation score
  const score = reputation.score
  let riskLevel: "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  if (score >= 80) riskLevel = "CRITICAL"
  else if (score >= 60) riskLevel = "HIGH"
  else if (score >= 40) riskLevel = "MEDIUM"
  else if (score >= 20) riskLevel = "LOW"
  else riskLevel = "SAFE"

  // Build analysis recommendation
  const recommendation =
    score >= 60 ? "BLOCK" : score >= 40 ? "CAUTION" : "PROCEED"

  return NextResponse.json({
    // Core fields
    address,
    inputType: "address",
    riskScore: score,
    riskLevel,

    // On-chain verification
    isVerified: reputation.reportCount > 0,

    // Counts
    reportCount,
    threatCount,

    // Tags from both sources
    tags: addressTags.map(t => ({
      tag: t.tag,
      taggedBy: t.taggedBy,
      upvotes: t.upvotes,
      downvotes: t.downvotes
    })),
    threatTags: verifiedThreatTags.map(t => ({
      tag: t.threatType,
      label: t.explanation,
      severity: t.severity
    })),

    // Analysis
    lastScan: new Date().toISOString(),
    analysis: {
      reasoning: `Address has ${reportCount} reports (${threatCount} threats) with reputation score ${score}/100`,
      recommendation
    }
  })
}
