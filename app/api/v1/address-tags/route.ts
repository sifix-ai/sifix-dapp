/**
 * Address Tags API
 * POST /api/v1/address-tags — Create a tag for an address
 * GET /api/v1/address-tags — List all tags (with filters)
 */

import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { isValidEthereumAddress } from '@/lib/address-validation'
import { prisma } from '@/lib/prisma'

/**
 * POST — Create address tag
 */
export async function POST(request: NextRequest) {
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

    // Upsert tag
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
        upvotes: taggedBy ? 1 : 0, // Auto-upvote by creator
      },
    })

    return apiSuccess({
      tag: {
        id: tagRecord.id,
        tag: tagRecord.tag,
        taggedBy: tagRecord.taggedBy,
        createdAt: tagRecord.createdAt.toISOString(),
      },
    }, { message: 'Tag created successfully' })
  } catch (error) {
    console.error('Create tag error:', error)
    return apiError('Internal server error', '500')
  }
}

/**
 * GET — List address tags
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const tag = searchParams.get('tag')
    const taggedBy = searchParams.get('taggedBy')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (address) {
      const addr = await prisma.address.findUnique({
        where: { address: address.toLowerCase() },
      })
      if (!addr) {
        return apiSuccess({ data: [], pagination: { page, limit, total: 0, totalPages: 0 } })
      }
      where.addressId = addr.id
    }

    if (tag) {
      where.tag = { contains: tag, mode: 'insensitive' }
    }

    if (taggedBy) {
      where.taggedBy = taggedBy.toLowerCase()
    }

    const [tags, total] = await Promise.all([
      prisma.addressTag.findMany({
        where,
        include: {
          address: {
            select: { address: true, riskScore: true, riskLevel: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.addressTag.count({ where }),
    ])

    return apiSuccess({
      data: tags.map(t => ({
        id: t.id,
        tag: t.tag,
        taggedBy: t.taggedBy,
        upvotes: t.upvotes,
        downvotes: t.downvotes,
        score: t.upvotes - t.downvotes,
        createdAt: t.createdAt.toISOString(),
        address: t.address.address,
        addressRisk: t.address.riskLevel,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('List tags error:', error)
    return apiError('Internal server error', '500')
  }
}
