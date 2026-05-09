/**
 * Unified Scan Endpoint — Address, ENS, or Domain
 * GET /api/v1/scan/[address]
 *
 * Accepts:
 *   - 0x… Ethereum address
 *   - Domain / URL → database lookup
 */

import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { isValidEthereumAddress } from '@/lib/address-validation'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address: rawInput } = await params
    const input = decodeURIComponent(rawInput).trim()
    const checker = request.nextUrl.searchParams.get('checker') ?? undefined

    if (!input || input.length < 2) {
      return apiError('Input must be at least 2 characters', '400')
    }

    // Detect input type
    const isAddress = /^0x[a-fA-F0-9]{40}$/.test(input)
    const isDomain = !isAddress && /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(
      input.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
    )

    // ─── Address scan ───
    if (isAddress) {
      const addressData = await prisma.address.findUnique({
        where: { address: input.toLowerCase() },
        include: {
          tags: {
            select: { id: true, tag: true, taggedBy: true, upvotes: true, downvotes: true, createdAt: true },
            orderBy: { upvotes: 'desc' },
          },
          scans: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { id: true, createdAt: true },
          },
          _count: { select: { reports: true } },
        },
      })

      if (!addressData) {
        return apiSuccess({
          address: input.toLowerCase(),
          inputType: 'address',
          riskScore: 0,
          riskLevel: 'SAFE',
          isVerified: false,
          reportCount: 0,
          tags: [],
          lastScanned: null,
        })
      }

      return apiSuccess({
        address: addressData.address,
        inputType: 'address',
        riskScore: addressData.riskScore,
        riskLevel: addressData.riskLevel,
        isVerified: addressData.totalReports > 0,
        reportCount: addressData._count.reports,
        tags: addressData.tags.map(t => ({
          id: t.id,
          tag: t.tag,
          taggedBy: t.taggedBy,
          score: t.upvotes - t.downvotes,
          createdAt: t.createdAt.toISOString(),
        })),
        lastScanned: addressData.scans[0]?.createdAt?.toISOString() || null,
      })
    }

    // ─── Domain scan ───
    const cleanDomain = input
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]

    const scamDomain = await prisma.scamDomain.findUnique({
      where: { domain: cleanDomain },
    })

    const riskScore = scamDomain?.riskScore ?? 0
    const riskLevel = riskScore >= 80 ? 'CRITICAL'
      : riskScore >= 60 ? 'HIGH'
      : riskScore >= 40 ? 'MEDIUM'
      : riskScore >= 20 ? 'LOW' : 'SAFE'

    const result = {
      domain: cleanDomain,
      inputType: 'domain',
      isScam: !!scamDomain,
      riskScore,
      riskLevel,
      category: scamDomain?.category ?? 'UNKNOWN',
      description: scamDomain?.description || undefined,
      source: scamDomain?.source || undefined,
      checkedAt: new Date().toISOString(),
    }

    // Record search history (fire-and-forget)
    if (checker) {
      prisma.searchHistory.create({
        data: {
          userAddress: checker,
          searchType: 'domain',
          query: cleanDomain,
          riskScore,
          riskLevel,
          result: JSON.stringify(result),
        },
      }).catch(() => {})
    }

    return apiSuccess(result)
  } catch (error) {
    console.error('Scan error:', error)
    return apiError('Internal server error', '500')
  }
}
