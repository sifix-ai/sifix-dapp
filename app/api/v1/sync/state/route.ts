import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CRON_SECRET } from '@/lib/constants'

const SYNC_NAME = 'sifix_reputation_indexer'

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const state = await prisma.syncState.findUnique({ where: { name: SYNC_NAME } })

  return NextResponse.json({
    success: true,
    data: {
      name: SYNC_NAME,
      lastBlock: state?.lastBlock || 0,
      chainId: state?.chainId || 16602,
      source: state?.source || 'onchain',
      status: state?.status || 'active',
      lastSyncAt: state?.lastSyncAt || null,
    },
  })
}
