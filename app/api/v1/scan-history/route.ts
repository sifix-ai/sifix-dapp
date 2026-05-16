import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { apiSuccess, errors, withErrorHandler } from "@/lib/api-response"
import { isValidEthereumAddress } from "@/lib/address-validation"

/**
 * GET /api/v1/scan-history?address=0x...&page=1&limit=20
 * Retrieve scan history for a given address (as fromAddress or toAddress)
 */
export const GET = withErrorHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get("address")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)

  if (!address) {
    return errors.validation("Missing required query parameter: address")
  }

  if (!isValidEthereumAddress(address)) {
    return errors.invalidAddress()
  }
  
  const normalizedAddress = address.toLowerCase()

  const where = {
    OR: [
      {
        fromAddress: {
          equals: normalizedAddress,
          mode: "insensitive" as const,
        },
      },
      {
        toAddress: {
          equals: normalizedAddress,
          mode: "insensitive" as const,
        },
      },
    ],
  }

  const [scans, total] = await Promise.all([
    prisma.scanHistory.findMany({
      where,
      orderBy: { analyzedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.scanHistory.count({ where }),
  ])

  // Aggregate stats
  const stats = await prisma.scanHistory.aggregate({
    where,
    _avg: { riskScore: true },
    _max: { riskScore: true },
    _count: true,
  })

  return apiSuccess(
    {
      scans: scans.map((s) => ({
        id: s.id,
        from: s.fromAddress,
        to: s.toAddress,
        riskScore: s.riskScore,
        riskLevel: s.riskLevel,
        recommendation: s.recommendation,
        reasoning: s.reasoning,
        threats: s.threats ? JSON.parse(s.threats) : [],
        confidence: s.confidence,
        rootHash: s.rootHash,
        storageExplorer: s.storageExplorer,
        analyzedAt: s.analyzedAt.toISOString(),
      })),
      stats: {
        totalScans: stats._count,
        avgRiskScore: Math.round(stats._avg.riskScore || 0),
        maxRiskScore: stats._max.riskScore || 0,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  )
})
