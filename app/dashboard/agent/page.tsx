'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import {
  Sparkles,
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Fingerprint,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AGENTIC_ID_CONTRACT_ADDRESS, AGENTIC_ID_TOKEN_ID } from '@/config/contracts'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function AgentIdPage() {
  const { address, isConnected } = useAccount()
  const [status, setStatus] = useState<Status>('idle')
  const [config, setConfig] = useState<any>(null)
  const [authCheck, setAuthCheck] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const loadConfig = useCallback(async () => {
    try {
      setStatus('loading')
      const res = await fetch('/api/v1/agentic-id')
      const data = await res.json()
      setConfig(data.success ? data.data : data)
      setStatus('success')
    } catch (err: any) {
      setError(err.message)
      setStatus('error')
    }
  }, [])

  const checkAuth = useCallback(async () => {
    if (!address) return
    try {
      const res = await fetch('/api/v1/agentic-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check', user: address }),
      })
      const data = await res.json()
      setAuthCheck(data.success ? data.data : data)
    } catch {}
  }, [address])

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  useEffect(() => {
    if (isConnected && address) checkAuth()
  }, [isConnected, address, checkAuth])

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const explorerUrl = `https://chainscan-galileo.0g.ai/address/${AGENTIC_ID_CONTRACT_ADDRESS}`

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Dashboard
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Fingerprint className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Agentic ID</h1>
          <p className="text-white/60 text-sm">
            On-chain identity untuk SIFIX Agent (ERC-7857). Verifiable agent credentials di 0G Chain.
          </p>
        </div>

        {/* Contract Info */}
        <Card className="p-6 mb-4">
          <h3 className="text-sm font-medium text-white/60 mb-4">Contract Info</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Contract Address</span>
              <div className="flex items-center gap-2">
                <code className="text-xs text-[#a78bfa] font-mono">
                  {AGENTIC_ID_CONTRACT_ADDRESS.slice(0, 10)}...{AGENTIC_ID_CONTRACT_ADDRESS.slice(-8)}
                </code>
                <button
                  onClick={() => handleCopy(AGENTIC_ID_CONTRACT_ADDRESS)}
                  className="text-white/30 hover:text-white/60"
                >
                  {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                </button>
                <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 text-white/30 hover:text-white/60" />
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Token ID</span>
              <code className="text-xs text-white/80 font-mono">
                {AGENTIC_ID_TOKEN_ID || 'Not configured'}
              </code>
            </div>
            {config?.mintFee && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">Mint Fee</span>
                <span className="text-xs text-white/80">{config.mintFee} wei</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Chain</span>
              <span className="text-xs text-white/80">0G Galileo Testnet (16602)</span>
            </div>
          </div>
        </Card>

        {/* Authorization Status */}
        {!isConnected ? (
          <Card className="p-6 mb-4 border-yellow-500/20">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm font-medium text-yellow-400">Connect Wallet</p>
                <p className="text-xs text-white/40">Hubungkan wallet untuk cek status authorization</p>
              </div>
            </div>
          </Card>
        ) : authCheck ? (
          <Card className={`p-6 mb-4 ${authCheck.authorized ? 'border-green-500/20' : 'border-red-500/20'}`}>
            <div className="flex items-center gap-3 mb-3">
              {authCheck.authorized ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400" />
              )}
              <div>
                <p className={`text-sm font-medium ${authCheck.authorized ? 'text-green-400' : 'text-red-400'}`}>
                  {authCheck.authorized ? 'Authorized' : 'Not Authorized'}
                </p>
                <p className="text-xs text-white/40">
                  {address?.slice(0, 8)}...{address?.slice(-6)}
                </p>
              </div>
            </div>
            {authCheck.tokenId && (
              <div className="mt-2 p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <p className="text-xs text-white/50">Agent Token #{authCheck.tokenId}</p>
                <p className="text-xs text-white/30 mt-1">{authCheck.reason}</p>
              </div>
            )}
            {!authCheck.authorized && authCheck.enabled && (
              <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-300">
                  Wallet belum di-authorize. Minta owner SIFIX Agent untuk authorize wallet ini via{' '}
                  <code className="text-red-200">authorizeUsage()</code>.
                </p>
              </div>
            )}
            {!authCheck.enabled && (
              <div className="mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-xs text-blue-300">
                  Agentic ID guard tidak aktif (token ID belum dikonfigurasi). Semua user bisa pake agent.
                </p>
              </div>
            )}
          </Card>
        ) : (
          <Card className="p-6 mb-4">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 text-white/40 animate-spin" />
              <span className="text-xs text-white/40">Checking authorization...</span>
            </div>
          </Card>
        )}

        {/* How It Works */}
        <Card className="p-6 mb-4">
          <h3 className="text-sm font-medium text-white/80 mb-4">Cara Kerja</h3>
          <div className="space-y-4">
            {[
              {
                step: '1',
                title: 'Owner Mint Agent NFT',
                desc: 'SIFIX Agent di-register sebagai ERC-7857 NFT di 0G Chain. Metadata berisi model, capabilities, dan compute provider.',
              },
              {
                step: '2',
                title: 'Authorize User',
                desc: 'Owner memanggil authorizeUsage(tokenId, userWallet) untuk kasih akses ke user tertentu.',
              },
              {
                step: '3',
                title: 'Extension Verify',
                desc: 'Saat scan, API cek isAuthorizedUser on-chain. Kalo authorized, analysis jalan. Kalo engga, ditolak.',
              },
              {
                step: '4',
                title: 'Verified Results',
                desc: 'Hasil scan di 0G Storage bisa ditrace balik ke agent identity on-chain. Full provenance.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-xs font-medium text-white/80">{item.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 0G Stack */}
        <Card className="p-6">
          <h3 className="text-sm font-medium text-white/80 mb-4">0G Stack Integration</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Chain', status: true, desc: '0G Galileo Testnet' },
              { name: 'Compute', status: true, desc: 'AI Inference (default)' },
              { name: 'Storage', status: true, desc: 'Evidence storage' },
              { name: 'Agentic ID', status: !!AGENTIC_ID_TOKEN_ID, desc: AGENTIC_ID_TOKEN_ID ? `Token #${AGENTIC_ID_TOKEN_ID}` : 'Not minted' },
            ].map((item) => (
              <div key={item.name} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${item.status ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  <span className="text-xs font-medium text-white/80">{item.name}</span>
                </div>
                <p className="text-xs text-white/40">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
