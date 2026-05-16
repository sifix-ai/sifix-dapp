import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyApiAuth } from '@/lib/extension-auth'
import { AccuracyService } from '@/services/accuracy-service'

const VERIFY_THRESHOLD = Number(process.env.VOTE_VERIFY_THRESHOLD || 5)
const REJECT_THRESHOLD = Number(process.env.VOTE_REJECT_THRESHOLD || 5)
const MIN_UNIQUE = Number(process.env.VOTE_MIN_UNIQUE_VOTERS || 3)
const MIN_REPUTATION = Number(process.env.VOTE_REPUTATION_MIN || 50)

async function recomputeStatus(reportId: string) {
  const [votes, report] = await Promise.all([
    prisma.reportVote.findMany({ where: { reportId } }),
    prisma.threatReport.findUnique({ where: { id: reportId }, include: { addresses: true } }),
  ])

  const unique = new Set(votes.map(v => v.voterAddress)).size
  const net = votes.reduce((n, v) => n + (v.voteType === 'FOR' ? v.weight : -v.weight), 0)

  let status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'DISPUTED' = 'PENDING'
  if (unique >= MIN_UNIQUE && net >= VERIFY_THRESHOLD) status = 'VERIFIED'
  else if (unique >= MIN_UNIQUE && net <= -REJECT_THRESHOLD) status = 'REJECTED'

  await prisma.threatReport.update({
    where: { id: reportId },
    data: {
      status,
      verifiedAt: status === 'VERIFIED' ? new Date() : null,
      verifiedBy: status === 'VERIFIED' ? 'community' : null,
    },
  })

  if (report?.address?.address) {
    if (status === 'VERIFIED') {
      await AccuracyService.resolveWithCommunity(report.addresses.address, 'malicious', 'HIGH')
    } else if (status === 'REJECTED') {
      await AccuracyService.resolveWithCommunity(report.addresses.address, 'benign', 'SAFE')
    } else if (unique >= MIN_UNIQUE) {
      await AccuracyService.resolveWithCommunity(report.addresses.address, 'unclear', 'MEDIUM')
    }
  }

  return { status, uniqueVoters: unique, netScore: net }
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const votes = await prisma.reportVote.findMany({ where: { reportId: id }, orderBy: { createdAt: 'desc' } })
  const summary = await recomputeStatus(id)
  return NextResponse.json({ success: true, data: { votes, summary } })
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyApiAuth()
  if (!auth.authorized || !auth.walletAddress) return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: 401 })

  const voter = auth.walletAddress.toLowerCase()
  const { id } = await params
  const body = await request.json()
  const voteType = body?.voteType as string
  const reason = body?.reason as string | undefined

  if (!['FOR', 'AGAINST'].includes(voteType)) return NextResponse.json({ error: 'voteType must be FOR or AGAINST' }, { status: 400 })

  const rep = await prisma.reputationScore.findFirst({ where: { address: { address: voter } }, include: { addresses: true } }).catch(() => null)
  const score = rep?.overallScore ?? 0
  if (score < MIN_REPUTATION) return NextResponse.json({ error: `Minimum reputation ${MIN_REPUTATION} required` }, { status: 403 })

  await prisma.reportVote.upsert({
    where: { reportId_voterAddress: { reportId: id, voterAddress: voter } },
    update: { voteType, reason, weight: Math.max(1, Math.floor(score / 50)) },
    create: { reportId: id, voterAddress: voter, voteType, reason, weight: Math.max(1, Math.floor(score / 50)) },
  })

  const summary = await recomputeStatus(id)
  return NextResponse.json({ success: true, data: summary })
}
