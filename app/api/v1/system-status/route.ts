import { NextResponse } from 'next/server'

const ZERO_G_RPC_URL = process.env.ZERO_G_RPC_URL || 'https://evmrpc-testnet.0g.ai'
const ZERO_G_STORAGE_URL = process.env.ZERO_G_STORAGE_URL || 'https://indexer-storage-testnet-standard.0g.ai'

async function probe(name: string, fn: () => Promise<void>) {
  const started = Date.now()
  try {
    await fn()
    return { name, online: true, latencyMs: Date.now() - started }
  } catch {
    return { name, online: false, latencyMs: Date.now() - started }
  }
}

export async function GET(request: Request) {
  const [network, ai, storage] = await Promise.all([
    probe('0G Network', async () => {
      const r = await fetch(ZERO_G_RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] }),
      })
      if (!r.ok) throw new Error('rpc down')
    }),
    probe('AI Analysis', async () => {
      const base = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin
      const r = await fetch(`${base}/api/health`)
      if (!r.ok) throw new Error('ai down')
    }),
    probe('0G Storage', async () => {
      const r = await fetch(ZERO_G_STORAGE_URL, { method: 'GET' })
      if (!(r.ok || r.status === 405 || r.status === 403)) throw new Error('storage down')
    }),
  ])

  const systems = [network, ai, storage]
  const operational = systems.every((s) => s.online)
  return NextResponse.json({ success: true, data: { operational, systems, checkedAt: new Date().toISOString() } })
}
