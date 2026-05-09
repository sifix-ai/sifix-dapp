/**
 * Watchlist API
 * GET  /api/v1/watchlist — List watchlist entries for a user
 * POST /api/v1/watchlist — Add an address to the watchlist (upsert)
 */

import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { isValidEthereumAddress } from '@/lib/address-validation'
import { prisma } from '@/lib/prisma'

/**
 * GET — List watchlist entries for a user
 * Query params: ?userAddress=0x...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userAddress = searchParams.get('userAddress')

    if (!userAddress || !isValidEthereumAddress(userAddress)) {
      return apiError('Valid userAddress query parameter is required', '400')
    }

    const entries = await prisma.watchlist.findMany({
      where: { userAddress: userAddress.toLowerCase() },
      orderBy: { createdAt: 'desc' },
    })

    return apiSuccess(entries)
  } catch (error) {
    console.error('List watchlist error:', error)
    return apiError('Internal server error', '500')
  }
}

/**
 * POST — Add an address to the watchlist (upsert on unique constraint)
 * Body: { userAddress, watchedAddress, label? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userAddress, watchedAddress, label } = body

    if (!userAddress || !isValidEthereumAddress(userAddress)) {
      return apiError('Valid userAddress is required', '400')
    }

    if (!watchedAddress || !isValidEthereumAddress(watchedAddress)) {
      return apiError('Valid watchedAddress is required', '400')
    }

    if (label !== undefined && typeof label !== 'string') {
      return apiError('Label must be a string', '400')
    }

    const normalizedUser = userAddress.toLowerCase()
    const normalizedWatched = watchedAddress.toLowerCase()

    if (normalizedUser === normalizedWatched) {
      return apiError('Cannot watch your own address', '400')
    }

    const entry = await prisma.watchlist.upsert({
      where: {
        userAddress_watchedAddress: {
          userAddress: normalizedUser,
          watchedAddress: normalizedWatched,
        },
      },
      update: {
        ...(label !== undefined ? { label: label.trim() || null } : {}),
      },
      create: {
        userAddress: normalizedUser,
        watchedAddress: normalizedWatched,
        label: label?.trim() || null,
      },
    })

    return apiSuccess(entry)
  } catch (error) {
    console.error('Add to watchlist error:', error)
    return apiError('Internal server error', '500')
  }
}
