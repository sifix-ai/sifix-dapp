import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { OnchainRelayerService } from '@/services/onchain-relayer-service'
import { CRON_SECRET } from '@/lib/constants'

/**
 * POST /api/v1/threats/[id]/relay
 * Relay a single report to on-chain with retry policy
 * Protected by CRON_SECRET
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  // Get report with address
  const report = await prisma.threatReport.findUnique({
    where: { id },
    include: { address: true },
  })

  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 })
  }

  // Build report hash
  const reportHash = OnchainRelayerService.buildReportHash(
    report.id,
    report.address.address,
    report.explanation
  ) as `0x${string}`

  try {
    // Use the new retry-enabled method
    const result = await OnchainRelayerService.submitReportVoteWithRetry(
      id,
      report.address.address,
      reportHash,
      true // isScam = true for threats
    )

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Report successfully relayed to on-chain',
    })
  } catch (e: any) {
    console.error('[Relay] Error:', e)

    // Get updated report state (includes retry/dead-letter info)
    const updated = await prisma.threatReport.findUnique({
      where: { id },
      select: {
        id: true,
        localStatus: true,
        relayError: true,
        relayAttempts: true,
        deadLetter: true,
        nextRelayAt: true,
      },
    })

    return NextResponse.json(
      {
        success: false,
        error: e?.message || 'relay failed',
        data: updated,
        isDeadLetter: updated?.deadLetter || false,
        retryScheduled: !!updated?.nextRelayAt,
        nextRetryAt: updated?.nextRelayAt,
      },
      { status: 500 }
    )
  }
}
