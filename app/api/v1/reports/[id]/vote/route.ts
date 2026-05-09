/**
 * Report Vote API
 * POST /api/v1/reports/[id]/vote — Vote on a threat report
 */

import { NextRequest } from 'next/server'
import { apiSuccess, apiError, errors } from '@/lib/api-response'
import { isValidEthereumAddress } from '@/lib/address-validation'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return apiError('Report ID is required', '400')
    }

    const body = await request.json()
    const { vote, voterAddress } = body

    // Validate vote direction
    if (!vote || !['FOR', 'AGAINST'].includes(vote)) {
      return apiError('Vote must be "FOR" or "AGAINST"', '400')
    }

    // Validate voter address
    if (!voterAddress || !isValidEthereumAddress(voterAddress)) {
      return apiError('Valid voterAddress is required', '400')
    }

    const normalizedVoter = voterAddress.toLowerCase()

    // Find the report
    const report = await prisma.threatReport.findUnique({
      where: { id },
      include: { address: true },
    })

    if (!report) {
      return errors.notFound('Report')
    }

    // Prevent reporter from voting on their own report
    if (report.reporterAddress.toLowerCase() === normalizedVoter) {
      return apiError('Cannot vote on your own report', '400')
    }

    // Check if voter already voted (using confidence field as a simple mechanism)
    // In a production system this would use a separate votes table
    // For now, we use the simulationData JSON field to track voters
    let voters: Record<string, 'FOR' | 'AGAINST'> = {}
    if (report.simulationData) {
      try {
        voters = JSON.parse(report.simulationData)
      } catch {
        voters = {}
      }
    }

    if (voters[normalizedVoter]) {
      return errors.reportAlreadyVoted()
    }

    // Record the vote
    voters[normalizedVoter] = vote

    // Count votes
    const forVotes = Object.values(voters).filter((v) => v === 'FOR').length
    const againstVotes = Object.values(voters).filter((v) => v === 'AGAINST').length

    // Determine new status based on vote threshold
    let newStatus = report.status
    const totalVotes = forVotes + againstVotes
    if (totalVotes >= 3) {
      if (forVotes / totalVotes >= 0.7) {
        newStatus = 'VERIFIED'
      } else if (againstVotes / totalVotes >= 0.7) {
        newStatus = 'REJECTED'
      }
    }

    // Update the report
    const updated = await prisma.threatReport.update({
      where: { id },
      data: {
        simulationData: JSON.stringify(voters),
        status: newStatus,
        ...(newStatus === 'VERIFIED' && {
          verifiedAt: new Date(),
        }),
      },
    })

    return apiSuccess({
      id: updated.id,
      status: updated.status,
      voteCounts: {
        for: forVotes,
        against: againstVotes,
      },
      yourVote: vote,
    })
  } catch (error) {
    console.error('Vote on report error:', error)
    return apiError('Internal server error', '500')
  }
}
