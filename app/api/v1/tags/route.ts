/**
 * Tags API
 * GET  /api/v1/tags — List all unique tags with counts
 * POST /api/v1/tags — Create a tag for an address
 */

import { NextRequest, NextResponse } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { isValidEthereumAddress } from '@/lib/address-validation'
import { prisma } from '@/lib/prisma'
import { verifyApiAuth } from '@/lib/extension-auth'

/**
 * GET — List all address tags with details
 * Query: ?search=...&limit=50&view=addresses (default) or view=tags
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const view = searchParams.get('view') || 'addresses' // 'addresses' or 'tags'

    // If view=tags, return aggregated tag counts (old behavior)
    if (view === 'tags') {
      const where: any = {}
      if (search) {
        where.tag = { contains: search }
      }

      const tags = await prisma.addressTag.groupBy({
        by: ['tag'],
        where,
        _count: { tag: true },
        _sum: { upvotes: true, downvotes: true },
        orderBy: { _count: { tag: 'desc' } },
        take: limit,
      })

      const data = tags.map((t) => ({
        tag: t.tag,
        count: t._count.tag,
        upvotes: t._sum.upvotes ?? 0,
        downvotes: t._sum.downvotes ?? 0,
        score: (t._sum.upvotes ?? 0) - (t._sum.downvotes ?? 0),
      }))

      return apiSuccess(data)
    }

    // Default: return addresses with their tags
    const where: any = {}
    if (search) {
      where.OR = [
        { tag: { contains: search } },
        { address: { address: { contains: search } } },
      ]
    }

    const addressTags = await prisma.addressTag.findMany({
      where,
      include: {
        address: true,
      },
      orderBy: [
        { createdAt: 'desc' },
      ],
      take: limit,
    })

    const data = addressTags.map((t) => ({
      id: t.id,
      tag: t.tag,
      taggedBy: t.taggedBy,
      upvotes: t.upvotes,
      downvotes: t.downvotes,
      score: t.upvotes - t.downvotes,
      createdAt: t.createdAt.toISOString(),
      address: t.address.address,
      addressRisk: t.address.riskLevel || 'UNKNOWN',
    }))

    return apiSuccess(data)
  } catch (error) {
    console.error('List tags error:', error)
    return apiError('Internal server error', '500')
  }
}

/**
 * POST — Create tag for address
 * Body: { address, tag, taggedBy? }
 */
export async function POST(request: NextRequest) {
  // Auth check
  const auth = await verifyApiAuth()
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error || 'Authentication required' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { address, tag, taggedBy } = body

    if (!address || !isValidEthereumAddress(address)) {
      return apiError('Valid Ethereum address is required', '400')
    }

    if (!tag || typeof tag !== 'string' || tag.trim().length < 1) {
      return apiError('Tag is required', '400')
    }

    if (taggedBy && !isValidEthereumAddress(taggedBy)) {
      return apiError('Invalid taggedBy address', '400')
    }

    // Find or create address
    let addressRecord = await prisma.address.findUnique({
      where: { address: address.toLowerCase() },
    })

    if (!addressRecord) {
      addressRecord = await prisma.address.create({
        data: {
          address: address.toLowerCase(),
          riskScore: 0,
          riskLevel: 'LOW',
        },
      })
    }

    // Upsert tag (same address+tag combination)
    const tagRecord = await prisma.addressTag.upsert({
      where: {
        addressId_tag: {
          addressId: addressRecord.id,
          tag: tag.trim(),
        },
      },
      update: {
        taggedBy: taggedBy?.toLowerCase() || null,
      },
      create: {
        addressId: addressRecord.id,
        tag: tag.trim(),
        taggedBy: taggedBy?.toLowerCase() || null,
        upvotes: taggedBy ? 1 : 0,
      },
    })

    return apiSuccess({
      tag: {
        id: tagRecord.id,
        tag: tagRecord.tag,
        taggedBy: tagRecord.taggedBy,
        upvotes: tagRecord.upvotes,
        downvotes: tagRecord.downvotes,
        createdAt: tagRecord.createdAt.toISOString(),
      },
    }, { message: 'Tag created successfully' })
  } catch (error) {
    console.error('Create tag error:', error)
    return apiError('Internal server error', '500')
  }
}
