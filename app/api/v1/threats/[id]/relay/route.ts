import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { OnchainRelayerService } from '@/services/onchain-relayer-service'
import { CRON_SECRET } from '@/lib/constants'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!CRON_SECRET || token !== CRON_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const report = await prisma.threatReport.findUnique({ where: { id }, include: { address: true } })
  if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 })

  const reportHash = OnchainRelayerService.buildReportHash(report.id, report.address.address, report.explanation) as `0x${string}`

  try {
    const attempts = (report.relayAttempts || 0) + 1
    await prisma.threatReport.update({ where: { id }, data: { localStatus: 'QUEUED', reportHash, relayAttempts: attempts, nextRelayAt: null } })
    const relayed = await OnchainRelayerService.submitReportVote(report.address.address, reportHash, true)
    const updated = await prisma.threatReport.update({
      where: { id },
      data: {
        onchainStatus: 'SUBMITTED',
        localStatus: 'SYNCED',
        onchainTxHash: relayed.txHash,
        blockNumber: relayed.blockNumber,
        chainId: relayed.chainId,
        contractAddress: relayed.contractAddress,
        relayedAt: new Date(),
        relayError: null,
      },
    })
    return NextResponse.json({ success: true, data: updated })
  } catch (e: any) {
    const maxRetry = Number(process.env.RELAY_MAX_RETRY || 5)
    const retryDelayMin = Number(process.env.RELAY_RETRY_DELAY_MINUTES || 10)
    const nextAttempts = (report.relayAttempts || 0) + 1
    const hasRetry = nextAttempts < maxRetry
    const nextRelayAt = hasRetry ? new Date(Date.now() + retryDelayMin * 60_000) : null

    const updated = await prisma.threatReport.update({
      where: { id },
      data: {
        localStatus: 'RELAY_FAILED',
        relayError: e?.message || 'relay failed',
        relayAttempts: nextAttempts,
        nextRelayAt,
      },
    })
    return NextResponse.json({ success: false, data: updated, error: e?.message || 'relay failed', retryScheduled: Boolean(nextRelayAt) }, { status: 500 })
  }
}
