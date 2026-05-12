import { prisma } from '@/lib/prisma'
import { EXTERNAL_APIS } from '@/lib/constants'

type SyncResult = { success: boolean; source: string; recordsAdded: number; recordsUpdated: number; duration: number }

async function upsertAddress(address: string, source: string, patch: Record<string, any>) {
  const found = await prisma.address.findUnique({ where: { address: address.toLowerCase() } })
  if (found) {
    await prisma.address.update({ where: { address: address.toLowerCase() }, data: { ...patch, source, updatedAt: new Date() } })
    return 'updated' as const
  }
  await prisma.address.create({ data: { address: address.toLowerCase(), source, chain: '0g-galileo', ...patch } })
  return 'added' as const
}

export async function syncDefiLlama(): Promise<SyncResult> {
  const started = Date.now(); let added = 0; let updated = 0
  const res = await fetch(`${EXTERNAL_APIS.DEFILLAMA.BASE_URL}${EXTERNAL_APIS.DEFILLAMA.PROTOCOLS_ENDPOINT}`)
  const rows = await res.json() as Array<{ url?: string; tvl?: number; name?: string; category?: string }>
  for (const r of rows.slice(0, 300)) {
    const domain = r.url?.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
    if (!domain) continue
    const x = await prisma.scamDomain.findUnique({ where: { domain } })
    if (!x) {
      await prisma.scamDomain.create({ data: { domain, source: 'defillama', category: r.category || 'DEFI', riskScore: 0, description: r.name || 'Known protocol', confidence: 90 } })
      added++
    } else updated++
  }
  return { success: true, source: 'defillama', recordsAdded: added, recordsUpdated: updated, duration: Date.now() - started }
}

export async function syncScamSniffer(): Promise<SyncResult> {
  const started = Date.now(); let added = 0; let updated = 0
  const res = await fetch(`${EXTERNAL_APIS.SCAMSNIFFER.RAW_URL}${EXTERNAL_APIS.SCAMSNIFFER.ADDRESS_ENDPOINT}`)
  const rows = await res.json() as Array<{ address?: string; labels?: string[]; reason?: string }>
  for (const r of rows.slice(0, 1000)) {
    if (!r.address) continue
    const result = await upsertAddress(r.address, 'EXTERNAL', { status: 'SCAM', riskScore: 95, riskLevel: 'CRITICAL', description: r.reason || r.labels?.join(', ') || 'ScamSniffer flagged' })
    if (result === 'added') added++; else updated++
  }
  return { success: true, source: 'scamsniffer', recordsAdded: added, recordsUpdated: updated, duration: Date.now() - started }
}

export async function syncCryptoScamDB(): Promise<SyncResult> {
  const started = Date.now(); let added = 0; let updated = 0
  const res = await fetch(`${EXTERNAL_APIS.CRYPTOSCAMDB.BASE_URL}/scams`)
  const rows = await res.json() as Array<{ addresses?: string[]; category?: string; name?: string }>
  for (const r of rows.slice(0, 500)) {
    for (const a of r.addresses || []) {
      const result = await upsertAddress(a, 'EXTERNAL', { status: 'SCAM', riskScore: 90, riskLevel: 'HIGH', description: `${r.name || 'CryptoScamDB'} (${r.category || 'SCAM'})` })
      if (result === 'added') added++; else updated++
    }
  }
  return { success: true, source: 'cryptoscamdb', recordsAdded: added, recordsUpdated: updated, duration: Date.now() - started }
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
