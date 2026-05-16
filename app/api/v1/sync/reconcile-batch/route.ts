import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CRON_SECRET } from '@/lib/constants'

export async function POST(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { events, votes, lastBlock, chainId = 16602 } = body

    const normalizedEvents = Array.isArray(events)
      ? events
      : Array.isArray(votes)
        ? votes.map((v: any) => ({
            txHash: v.txHash,
            logIndex: v.logIndex,
            blockNumber: v.blockNumber,
            reporter: v.reporter,
            target: v.targetId || v.reporter,
            targetId: v.targetId || '',
            evidenceHash: v.reasonHash,
            severity: v.isScam ? 80 : 20,
            threatType: 0,
          }))
        : []

    if (!normalizedEvents.length) {
      return NextResponse.json(
        { error: 'Invalid body: events must be a non-empty array' },
        { status: 400 }
      )
    }

    const activeContractAddress = process.env.NEXT_PUBLIC_SIFIX_CONTRACT || '0xBBa8b030D80113e50271a2bbEeDBE109D9f1C42e'

    let synced = 0
    let notFound = 0
    let autoCreated = 0
    let skipped = 0
    let errors: Array<{ vote: any; error: string }> = []

    for (const event of normalizedEvents) {
      try {
        const { evidenceHash, severity, reporter, blockNumber, txHash, logIndex, targetId, target, threatType } = event
        const isScam = Number(severity || 0) >= 60 || Number(threatType || 0) > 0

        const existingByTx = await prisma.threatReport.findFirst({
          where: { onchainTxHash: txHash, blockNumber: blockNumber || undefined },
        })
        if (existingByTx && typeof logIndex === 'number') {
          skipped++
          continue
        }

        let report: Awaited<ReturnType<typeof prisma.threatReport.findFirst<{ include: { addresses: true } }>>> | null = null

        report = await prisma.threatReport.findFirst({
          where: {
            reportHash: evidenceHash?.toLowerCase?.() || evidenceHash,
            deadLetter: false,
          },
          include: { addresses: true },
        })

        if (!report) {
          notFound++
          const targetAddress = (target || targetId || reporter || '').toLowerCase()
          if (!targetAddress) {
            skipped++
            continue
          }

          const addressRecord = await prisma.address.upsert({
            where: { address: targetAddress },
            create: { address: targetAddress, chain: '0g-galileo', addressType: 'EOA' },
            update: {},
          })

          await prisma.threatReport.create({
            data: {
              addressId: addressRecord.id,
              reporterAddress: reporter?.toLowerCase() || '',
              threatType: 'COMMUNITY_REPORT',
              severity: isScam ? 80 : 20,
              riskLevel: isScam ? 'HIGH' : 'LOW',
              evidenceHash: evidenceHash || '',
              explanation: 'On-chain report via SifixReputation contract',
              confidence: 70,
              reportHash: evidenceHash?.toLowerCase(),
              onchainTxHash: txHash,
              blockNumber: blockNumber,
              chainId: chainId,
              contractAddress: activeContractAddress,
              onchainStatus: 'VERIFIED',
              localStatus: 'SYNCED_ONCHAIN',
              status: 'VERIFIED',
              relayedAt: new Date(),
            },
          })
          autoCreated++
          synced++
          continue
        }

        await prisma.threatReport.update({
          where: { id: report.id },
          data: {
            onchainStatus: 'VERIFIED',
            localStatus: 'SYNCED_ONCHAIN',
            onchainTxHash: txHash || report.onchainTxHash,
            blockNumber: blockNumber || report.blockNumber,
            chainId,
            contractAddress: activeContractAddress,
            relayError: null,
            relayedAt: report.relayedAt || new Date(),
          },
        })

        synced++
      } catch (e: any) {
        errors.push({ vote: event, error: e?.message || 'unknown error' })
      }
    }

    if (lastBlock) {
      await prisma.syncState.upsert({
        where: { name: 'sifix_reputation_indexer' },
        create: {
          name: 'sifix_reputation_indexer',
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

    await prisma.syncLog.create({
      data: {
        source: 'onchain',
        status: errors.length ? 'failed' : 'success',
        recordsAdded: autoCreated,
        recordsUpdated: synced - autoCreated,
        error: errors.length ? JSON.stringify(errors.slice(0, 10)) : null,
        completedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: { synced, notFound, autoCreated, skipped, errors: errors.length, errorDetails: errors.slice(0, 10), lastBlock },
    })
  } catch (e: any) {
    console.error('[Reconcile Batch] Error:', e)
    return NextResponse.json({ error: e?.message || 'Internal server error' }, { status: 500 })
  }
}
