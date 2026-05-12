import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CRON_SECRET } from '@/lib/constants'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!CRON_SECRET || token !== CRON_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const status = body?.status as string
  const reviewedBy = body?.reviewedBy as string
  const overrideReason = body?.overrideReason as string

  if (!['PENDING', 'VERIFIED', 'REJECTED', 'DISPUTED'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const updated = await prisma.threatReport.update({
    where: { id },
    data: {
      status,
      verifiedBy: reviewedBy || 'admin',
      verifiedAt: status === 'VERIFIED' ? new Date() : null,
      simulationData: JSON.stringify({ overrideReason, overriddenAt: new Date().toISOString(), reviewedBy }),
    },
  })

  return NextResponse.json({ success: true, data: updated })
}
