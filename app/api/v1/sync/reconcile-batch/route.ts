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
    const { votes, lastBlock, chainId = 16602 } = body

    if (!Array.isArray(votes) || !votes.length) {
      return NextResponse.json(
        { error: 'Invalid body: votes must be a non-empty array' },
        { status: 400 }
      )
    }

    let synced = 0
    let notFound = 0
    let autoCreated = 0
    let skipped = 0
    let errors: Array<{ vote: any; error: string }> = []

    for (const vote of votes) {
      try {
        const { reasonHash, isScam, reporter, blockNumber, txHash, logIndex, targetId } = vote

        const existingByTx = await prisma.threatReport.findFirst({
          where: { onchainTxHash: txHash, blockNumber: blockNumber || undefined },
        })
        if (existingByTx && typeof logIndex === 'number') {
          skipped++
          continue
        }

        let report: Awaited<ReturnType<typeof prisma.threatReport.findFirst<{ include: { address: true } }>>> | null = null

        report = await prisma.threatReport.findFirst({
          where: {
            reportHash: reasonHash?.toLowerCase?.() || reasonHash,
            deadLetter: false,
          },
          include: { address: true },
        })

        if (!report) {
          notFound++
          const targetAddress = (targetId || reporter || '').toLowerCase()
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
              evidenceHash: reasonHash || '',
              explanation: 'On-chain vote via ScamReporter contract',
              confidence: 70,
              reportHash: reasonHash?.toLowerCase(),
              onchainTxHash: txHash,
              blockNumber: blockNumber,
              chainId: chainId,
              contractAddress: '0x544a39149d5169E4e1bDf7F8492804224CB70152',
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
            contractAddress: '0x544a39149d5169E4e1bDf7F8492804224CB70152',
            relayError: null,
            relayedAt: report.relayedAt || new Date(),
          },
        })

        synced++
      } catch (e: any) {
        errors.push({ vote, error: e?.message || 'unknown error' })
      }
    }

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
