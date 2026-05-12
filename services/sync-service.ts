import { prisma } from '@/lib/prisma'
import { EXTERNAL_APIS } from '@/lib/constants'

type SyncResult = { success: boolean; source: string; recordsAdded: number; recordsUpdated: number; duration: number }

async function upsertAddress(address: string, patch: { riskScore?: number; riskLevel?: string; addressType?: string } = {}) {
  return prisma.address.upsert({
    where: { address: address.toLowerCase() },
    create: {
      address: address.toLowerCase(),
      chain: '0g-galileo',
      addressType: patch.addressType || 'EOA',
      riskScore: patch.riskScore ?? 0,
      riskLevel: patch.riskLevel ?? 'LOW',
    },
    update: {
      riskScore: patch.riskScore ?? undefined,
      riskLevel: patch.riskLevel ?? undefined,
      lastSeenAt: new Date(),
    },
  })
}

export async function syncDefiLlama(): Promise<SyncResult> {
  const started = Date.now(); let added = 0; let updated = 0
  const res = await fetch(`${EXTERNAL_APIS.DEFILLAMA.BASE_URL}${EXTERNAL_APIS.DEFILLAMA.PROTOCOLS_ENDPOINT}`)
  const rows = await res.json() as Array<{ url?: string; tvl?: number; name?: string; category?: string }>
  for (const r of rows.slice(0, 300)) {
    const domain = r.url?.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
    if (!domain) continue
    const existing = await prisma.scamDomain.findUnique({ where: { domain } })
    if (!existing) {
      await prisma.scamDomain.create({
        data: {
          domain,
          source: 'defillama',
          category: r.category || 'DEFI',
          riskScore: 0,
          description: r.name || 'Known protocol',
          isActive: true,
        },
      })
      added++
    } else {
      updated++
    }
  }
  return { success: true, source: 'defillama', recordsAdded: added, recordsUpdated: updated, duration: Date.now() - started }
}

export async function syncScamSniffer(): Promise<SyncResult> {
  const started = Date.now(); let added = 0; let updated = 0
  const res = await fetch(`${EXTERNAL_APIS.SCAMSNIFFER.RAW_URL}${EXTERNAL_APIS.SCAMSNIFFER.ADDRESS_ENDPOINT}`)
  const rows = await res.json() as Array<{ address?: string; labels?: string[]; reason?: string }>
  for (const r of rows.slice(0, 1000)) {
    if (!r.address) continue
    const found = await prisma.address.findUnique({ where: { address: r.address.toLowerCase() } })
    if (!found) {
      await prisma.address.create({
        data: {
          address: r.address.toLowerCase(),
          chain: '0g-galileo',
          addressType: 'EOA',
          riskScore: 95,
          riskLevel: 'CRITICAL',
        },
      })
      added++
    } else {
      await prisma.address.update({
        where: { address: r.address.toLowerCase() },
        data: { riskScore: 95, riskLevel: 'CRITICAL', lastSeenAt: new Date() },
      })
      updated++
    }
  }
  return { success: true, source: 'scamsniffer', recordsAdded: added, recordsUpdated: updated, duration: Date.now() - started }
}

export async function syncCryptoScamDB(): Promise<SyncResult> {
  const started = Date.now(); let added = 0; let updated = 0
  const res = await fetch(`${EXTERNAL_APIS.CRYPTOSCAMDB.BASE_URL}/scams`)
  const rows = await res.json() as Array<{ addresses?: string[]; category?: string; name?: string }>
  for (const r of rows.slice(0, 500)) {
    for (const a of r.addresses || []) {
      const found = await prisma.address.findUnique({ where: { address: a.toLowerCase() } })
      if (!found) {
        await prisma.address.create({
          data: {
            address: a.toLowerCase(),
            chain: '0g-galileo',
            addressType: 'EOA',
            riskScore: 95,
            riskLevel: 'CRITICAL',
          },
        })
        added++
      } else {
        await prisma.address.update({
          where: { address: a.toLowerCase() },
          data: { riskScore: 95, riskLevel: 'CRITICAL', lastSeenAt: new Date() },
        })
        updated++
      }
    }
  }
  return { success: true, source: 'cryptoscamdb', recordsAdded: added, recordsUpdated: updated, duration: Date.now() - started }
}

export async function syncOnchainEvents(): Promise<SyncResult> {
  const started = Date.now()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const cronSecret = process.env.CRON_SECRET || ''

  const res = await fetch(`${baseUrl}/api/v1/sync/reconcile-batch`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${cronSecret}`,
    },
    body: JSON.stringify({ source: 'onchain' }),
  })

  if (!res.ok) {
    const text = await res.text()
    return { success: false, source: 'onchain', recordsAdded: 0, recordsUpdated: 0, duration: Date.now() - started }
  }

  const data = await res.json() as { data?: { synced?: number; notFound?: number } }
  return {
    success: true,
    source: 'onchain',
    recordsAdded: data.data?.synced || 0,
    recordsUpdated: 0,
    duration: Date.now() - started,
  }
}

export async function runAllSyncs() {
  const started = Date.now()
  const results = await Promise.allSettled([syncDefiLlama(), syncScamSniffer(), syncCryptoScamDB()])
  const ok = results.filter((r): r is PromiseFulfilledResult<SyncResult> => r.status === 'fulfilled').map(r => r.value)
  return {
    results,
    totalAdded: ok.reduce((n, r) => n + r.recordsAdded, 0),
    totalUpdated: ok.reduce((n, r) => n + r.recordsUpdated, 0),
    totalDuration: Date.now() - started,
  }
}
