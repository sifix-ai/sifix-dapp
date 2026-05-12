import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CRON_SECRET } from '@/lib/constants'

const SYNC_KEY = 'onchain_reconcile'

type IndexedEvent = {
  txHash: string
  blockNumber: number
  reasonHash: string
  contractAddress?: string
  chainId?: number
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!CRON_SECRET || token !== CRON_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const events = (body?.events || []) as IndexedEvent[]
  if (!Array.isArray(events) || events.length === 0) {
    return NextResponse.json({ success: true, data: { updated: 0, cursor: null } })
  }

  let updated = 0
  let highestBlock = 0
  let lastTx: string | null = null

  for (const ev of events) {
    if (!ev?.reasonHash || !ev?.txHash || !ev?.blockNumber) continue

    const report = await prisma.threatReport.findFirst({ where: { reportHash: ev.reasonHash } })
    if (!report) continue

    await prisma.threatReport.update({
      where: { id: report.id },
      data: {
        localStatus: 'SYNCED',
        onchainStatus: 'SUBMITTED',
        onchainTxHash: ev.txHash,
        blockNumber: ev.blockNumber,
        chainId: ev.chainId || 16602,
        contractAddress: ev.contractAddress || report.contractAddress,
        relayError: null,
        relayedAt: report.relayedAt || new Date(),
      },
    })

    updated += 1
    if (ev.blockNumber > highestBlock) {
      highestBlock = ev.blockNumber
      lastTx = ev.txHash
    }
  }

  if (highestBlock > 0) {
    await prisma.syncState.upsert({
      where: { key: SYNC_KEY },
      update: { lastIndexedBlock: highestBlock, lastIndexedTx: lastTx || undefined },
      create: { key: SYNC_KEY, lastIndexedBlock: highestBlock, lastIndexedTx: lastTx || undefined },
    })
  }

  return NextResponse.json({ success: true, data: { updated, cursor: highestBlock > 0 ? { block: highestBlock, tx: lastTx } : null } })
}
