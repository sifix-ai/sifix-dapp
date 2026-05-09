/**
 * Report Vote Status API
 * GET /api/v1/reports/vote-status — Check if a voter has voted on reports for an address
 */

import { NextRequest } from 'next/server'
import { apiSuccess, apiError } from '@/lib/api-response'
import { isValidEthereumAddress } from '@/lib/address-validation'
import { prisma } from '@/lib/prisma'

/**
 * GET — Check if voter has voted
 * Query: ?address=0x...&voterAddress=0x...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const voterAddress = searchParams.get('voterAddress')

    if (!address || !isValidEthereumAddress(address)) {
      return apiError('Valid address query parameter is required', '400')
    }

    if (!voterAddress || !isValidEthereumAddress(voterAddress)) {
      return apiError('Valid voterAddress query parameter is required', '400')
    }

    const normalizedVoter = voterAddress.toLowerCase()

    // Find the address record
    const addressRecord = await prisma.address.findUnique({
      where: { address: address.toLowerCase() },
      include: {
        reports: {
          where: { status: 'PENDING' },
          select: {
            id: true,
            simulationData: true,
            reporterAddress: true,
            threatType: true,
            severity: true,
            status: true,
            createdAt: true,
          },
        },
      },
    })

    if (!addressRecord) {
      return apiSuccess({
        address: address.toLowerCase(),
        voterAddress: normalizedVoter,
        reports: [],
      })
    }

    // Check vote status for each report
    const reports = addressRecord.reports.map((report) => {
      let voters: Record<string, string> = {}
      if (report.simulationData) {
        try {
          voters = JSON.parse(report.simulationData)
        } catch {
          voters = {}
        }
      }

      const hasVoted = normalizedVoter in voters
      const isReporter = report.reporterAddress.toLowerCase() === normalizedVoter

      return {
        id: report.id,
        threatType: report.threatType,
        severity: report.severity,
        status: report.status,
        createdAt: report.createdAt.toISOString(),
        hasVoted,
        yourVote: hasVoted ? voters[normalizedVoter] : null,
        canVote: !hasVoted && !isReporter,
      }
    })

    return apiSuccess({
      address: addressRecord.address,
      voterAddress: normalizedVoter,
      reports,
    })
  } catch (error) {
    console.error('Vote status error:', error)
    return apiError('Internal server error', '500')
  }
}
