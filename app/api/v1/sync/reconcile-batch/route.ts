import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CRON_SECRET } from '@/lib/constants'

/**
 * POST /api/v1/sync/reconcile-batch
 * Internal endpoint for indexer to sync batch of onchain votes
 * Protected by CRON_SECRET
 */
export async function POST(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      votes,
      lastBlock,
      chainId = 16602,
    } = body

    if (!Array.isArray(votes) || !votes.length) {
      return NextResponse.json(
        { error: 'Invalid body: votes must be a non-empty array' },
        { status: 400 }
      )
    }

    let synced = 0
    let notFound = 0
    let errors: Array<{ vote: any; error: string }> = []

    for (const vote of votes) {
      try {
        const { reasonHash, isScam, reporter, blockNumber, txHash } = vote

        // Find report by reportHash (reasonHash)
        const report = await prisma.threatReport.findFirst({
          where: {
            reportHash: reasonHash?.toLowerCase?.() || reasonHash,
            deadLetter: false, // Skip dead letters
          },
          include: { address: true },
        })

        if (!report) {
          notFound++
          continue
        }

        // Update report with onchain status
        await prisma.threatReport.update({
          where: { id: report.id },
          data: {
            onchainStatus: 'VERIFIED',
            localStatus: 'SYNCED_ONCHAIN',
            onchainTxHash: txHash || report.onchainTxHash,
            blockNumber: blockNumber || report.blockNumber,
            chainId: chainId,
            contractAddress: '0x544a39149d5169E4e1bDf7F8492804224CB70152', // ScamReporter
            relayError: null,
            relayedAt: report.relayedAt || new Date(),
          },
        })

        synced++
      } catch (e: any) {
        errors.push({ vote, error: e?.message || 'unknown error' })
      }
    }

    // Update sync state cursor
    if (lastBlock) {
      await prisma.syncState.upsert({
        where: { name: 'scam_vote_indexer' },
        create: {
          name: 'scam_vote_indexer',
          lastBlock,
          chainId,
          source: 'onchain',
          status: 'active',
          lastSyncAt: new Date(),
        },
        update: {
          lastBlock,
          chainId,
          lastSyncAt: new Date(),
          status: 'active',
          errorMessage: null,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        synced,
        notFound,
        errors: errors.length,
        errorDetails: errors.slice(0, 10), // Limit error details
        lastBlock,
      },
    })
  } catch (e: any) {
    console.error('[Reconcile Batch] Error:', e)
    return NextResponse.json(
      { error: e?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
