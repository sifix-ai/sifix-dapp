/**
 * Search History API
 * GET /api/v1/history — Search history entries
 */

import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'

/**
 * GET — Search history
 * Query: ?checker=0x...&type=all|address|domain&limit=50
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const checker = searchParams.get('checker')
    const type = searchParams.get('type') || 'all'
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)

    // Build where clause
    const where: any = {}

    if (checker) {
      where.userAddress = checker.toLowerCase()
    }

    if (type && type !== 'all') {
      // searchType stores "address" or "domain" (or "transaction")
      const validTypes = ['address', 'domain', 'transaction']
      if (validTypes.includes(type.toLowerCase())) {
        where.searchType = type.toLowerCase()
      }
    }

    const history = await prisma.searchHistory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    const data = history.map((entry) => ({
      id: entry.id,
      userAddress: entry.userAddress,
      searchType: entry.searchType,
      query: entry.query,
      riskScore: entry.riskScore,
      riskLevel: entry.riskLevel,
      result: entry.result,
      createdAt: entry.createdAt.toISOString(),
    }))

    return apiSuccess(data)
  } catch (error) {
    console.error('Search history error:', error)
    return apiError('Internal server error', '500')
  }
}
