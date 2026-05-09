/**
 * Watchlist Entry API
 * GET    /api/v1/watchlist/[address] — Get a single watchlist entry
 * DELETE /api/v1/watchlist/[address] — Remove an address from the watchlist
 */

import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { isValidEthereumAddress } from '@/lib/address-validation'
import { prisma } from '@/lib/prisma'

/**
 * GET — Get a single watchlist entry
 * Query params: ?userAddress=0x...
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params
    const { searchParams } = new URL(request.url)
    const userAddress = searchParams.get('userAddress')

    if (!userAddress || !isValidEthereumAddress(userAddress)) {
      return apiError('Valid userAddress query parameter is required', '400')
    }

    if (!address || !isValidEthereumAddress(address)) {
      return apiError('Invalid Ethereum address format', '400')
    }

    const entry = await prisma.watchlist.findUnique({
      where: {
        userAddress_watchedAddress: {
          userAddress: userAddress.toLowerCase(),
          watchedAddress: address.toLowerCase(),
        },
      },
    })

    if (!entry) {
      return apiError('Watchlist entry not found', '404')
    }

    return apiSuccess(entry)
  } catch (error) {
    console.error('Get watchlist entry error:', error)
    return apiError('Internal server error', '500')
  }
}

/**
 * DELETE — Remove an address from the watchlist
 * Query params: ?userAddress=0x...
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params
    const { searchParams } = new URL(request.url)
    const userAddress = searchParams.get('userAddress')

    if (!userAddress || !isValidEthereumAddress(userAddress)) {
      return apiError('Valid userAddress query parameter is required', '400')
    }

    if (!address || !isValidEthereumAddress(address)) {
      return apiError('Invalid Ethereum address format', '400')
    }

    const entry = await prisma.watchlist.delete({
      where: {
        userAddress_watchedAddress: {
          userAddress: userAddress.toLowerCase(),
          watchedAddress: address.toLowerCase(),
        },
      },
    })

    return apiSuccess(entry)
  } catch (error: any) {
    // Prisma P2025 — record not found
    if (error?.code === 'P2025') {
      return apiError('Watchlist entry not found', '404')
    }

    console.error('Delete watchlist entry error:', error)
    return apiError('Internal server error', '500')
  }
}
