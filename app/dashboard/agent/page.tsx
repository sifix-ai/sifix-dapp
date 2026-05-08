'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import {
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Fingerprint,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
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

  // Guard: Wallet not connected
  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Fingerprint className="w-6 h-6 text-accent-blue" />
            Agentic ID
          </h2>
          <p className="text-white/50 text-sm mt-1">
            On-chain identity for SIFIX Agent (ERC-7857)
          </p>
        </div>

        <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
          <div className="p-12 text-center">
            <Fingerprint className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">Connect your wallet to view Agentic ID status</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Fingerprint className="w-6 h-6 text-accent-blue" />
          Agentic ID
        </h2>
        <p className="text-white/50 text-sm mt-1">
          On-chain identity for SIFIX Agent (ERC-7857). Verifiable agent credentials on 0G Chain.
        </p>
      </div>

      {/* Contract Info */}
      <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
        <h3 className="text-sm font-medium text-white/60 mb-4">Contract Information</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Contract Address</span>
            <div className="flex items-center gap-2">
              <code className="text-xs text-accent-blue font-mono">
                {AGENTIC_ID_CONTRACT_ADDRESS.slice(0, 10)}...{AGENTIC_ID_CONTRACT_ADDRESS.slice(-8)}
              </code>
              <button
                onClick={() => handleCopy(AGENTIC_ID_CONTRACT_ADDRESS)}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              </button>
              <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors">
                <ExternalLink className="w-3 h-3" />
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
            <span className="text-xs text-white/80">0G Newton Testnet (16602)</span>
          </div>
        </div>
      </Card>

      {/* Authorization Status */}
      {authCheck ? (
        <Card className={`bg-white/[0.04] backdrop-blur-md ${authCheck.authorized ? 'border-accent-blue/20' : 'border-red-500/20'}`}>
          <div className="flex items-center gap-3 mb-3">
            {authCheck.authorized ? (
              <CheckCircle className="w-6 h-6 text-accent-blue" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
            <div>
              <p className={`text-sm font-medium ${authCheck.authorized ? 'text-accent-blue' : 'text-red-400'}`}>
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
                Wallet not authorized. Ask SIFIX Agent owner to authorize this wallet via{' '}
                <code className="text-red-200">authorizeUsage()</code>.
              </p>
            </div>
          )}
          {!authCheck.enabled && (
            <div className="mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs text-blue-300">
                Agentic ID guard is not active (token ID not configured). All users can use the agent.
              </p>
            </div>
          )}
        </Card>
      ) : (
        <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
          <div className="flex items-center justify-center gap-2 py-4">
            <Loader2 className="w-4 h-4 text-white/40 animate-spin" />
            <span className="text-xs text-white/40">Checking authorization...</span>
          </div>
        </Card>
      )}

      {/* How It Works */}
      <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
        <h3 className="text-sm font-medium text-white/80 mb-4">How It Works</h3>
        <div className="space-y-4">
          {[
            {
              step: '1',
              title: 'Owner Mints Agent NFT',
              desc: 'SIFIX Agent is registered as an ERC-7857 NFT on 0G Chain. Metadata contains model, capabilities, and compute provider.',
            },
            {
              step: '2',
              title: 'Authorize Users',
              desc: 'Owner calls authorizeUsage(tokenId, userWallet) to grant access to specific users.',
            },
            {
              step: '3',
              title: 'Extension Verifies',
              desc: 'During scan, API checks isAuthorizedUser on-chain. If authorized, analysis proceeds. Otherwise, rejected.',
            },
            {
              step: '4',
              title: 'Verified Results',
              desc: 'Scan results in 0G Storage can be traced back to agent identity on-chain. Full provenance.',
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue text-xs font-bold shrink-0">
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
      <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
        <h3 className="text-sm font-medium text-white/80 mb-4">0G Stack Integration</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Chain', status: true, desc: '0G Newton Testnet' },
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
  )
}
