/**
 * Domain Check API
 * GET /api/v1/check-domain?domain=example.com
 *
 * Lightweight domain scam check — used by extension background worker.
 */

import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const domain = request.nextUrl.searchParams.get('domain')

    if (!domain) {
      return apiError('Domain parameter is required', '400')
    }

    // Clean up domain
    const cleanDomain = domain
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]

    // Look up scam domain
    const scamDomain = await prisma.scamDomain.findUnique({
      where: { domain: cleanDomain },
    })

    const riskScore = scamDomain?.riskScore ?? 0
    const riskLevel = riskScore >= 80 ? 'CRITICAL'
      : riskScore >= 60 ? 'HIGH'
      : riskScore >= 40 ? 'MEDIUM'
      : riskScore >= 20 ? 'LOW' : 'SAFE'

    return apiSuccess({
      domain: cleanDomain,
      isScam: !!scamDomain,
      riskScore,
      riskLevel,
      category: scamDomain?.category ?? 'UNKNOWN',
      description: scamDomain?.description || undefined,
      source: scamDomain?.source || undefined,
      checkedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Check domain error:', error)
    return apiError('Internal server error', '500')
  }
}
