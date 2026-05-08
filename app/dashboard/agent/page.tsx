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
  Cpu,
  Database,
  Globe,
  Users,
  FileCode,
  Hash,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { AGENTIC_ID_CONTRACT_ADDRESS, AGENTIC_ID_TOKEN_ID } from '@/config/contracts'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface AgentProfile {
  tokenId: string
  owner: string
  creator: string
  cloneSource: string
  intelligentData: Array<{
    dataDescription: string
    dataHash: string
  }>
  authorizedUsers: string[]
  metadata: {
    name: string
    model: string
    provider: string
    capabilities: string[]
  }
  knownHash: string
  hashVerified: boolean
}

export default function AgentIdPage() {
  const { address, isConnected } = useAccount()
  const [status, setStatus] = useState<Status>('idle')
  const [config, setConfig] = useState<any>(null)
  const [authCheck, setAuthCheck] = useState<any>(null)
  const [error, setError] = useState('')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [requestingAccess, setRequestingAccess] = useState(false)
  const [requestMessage, setRequestMessage] = useState<string | null>(null)
  const [requestError, setRequestError] = useState<string | null>(null)
  const [claimingFaucet, setClaimingFaucet] = useState(false)
  const [claimedFaucet, setClaimedFaucet] = useState(false)
  const [faucetError, setFaucetError] = useState<string | null>(null)
  const [faucetTxHash, setFaucetTxHash] = useState<string | null>(null)
  const [faucetAddress, setFaucetAddress] = useState<string | null>(null)
  const [faucetAmount, setFaucetAmount] = useState<string | null>(null)
  const [faucetCooldown, setFaucetCooldown] = useState<string | null>(null)
  const [showFaucetGuide, setShowFaucetGuide] = useState(false)

  const chainId = Number(process.env.NEXT_PUBLIC_ZG_CHAIN_ID || 16602)
  const rpcUrl = process.env.NEXT_PUBLIC_ZG_RPC_URL || 'https://evmrpc-testnet.0g.ai'
  const faucetBase = chainId === 16600 ? 'https://faucet.0g.ai/mainnet' : 'https://faucet.0g.ai/testnet'
  const faucetUrl = address ? `${faucetBase}?address=${address}` : faucetBase
  const txExplorerBase = chainId === 16600 ? 'https://chainscan-newton.0g.ai/tx' : 'https://chainscan-galileo.0g.ai/tx' 
  const addressExplorerBase = chainId === 16600 ? 'https://chainscan-newton.0g.ai/address' : 'https://chainscan-galileo.0g.ai/address' 
  const isGalileo = chainId === 16602
  const isMainnet = chainId === 16600
  const chainLabel = isMainnet ? '0G Newton Mainnet' : '0G Galileo Testnet'
  const normalizedRpc = rpcUrl.toLowerCase()

  const detectEndpoint = () => {
    if (normalizedRpc.includes('newton') || normalizedRpc.includes('mainnet')) return 'mainnet'
    if (normalizedRpc.includes('galileo') || normalizedRpc.includes('testnet')) return 'testnet'
    return 'unknown'
  }

  const endpoint = detectEndpoint()
  const faucetHint = endpoint === 'mainnet'
    ? 'Kamu pakai RPC mainnet. Faucet hanya kasih token testnet.'
    : endpoint === 'unknown'
      ? 'RPC kamu custom. Pastikan ini jaringan testnet sebelum claim faucet.'
      : null

  const hasMismatch = (isGalileo && endpoint === 'mainnet') || (isMainnet && endpoint === 'testnet')

  const normalizeAddress = (value: string) => value?.trim()

  const toAbsoluteUrl = (url: string) => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    if (url.startsWith('/')) return `https://faucet.0g.ai${url}`
    return `https://faucet.0g.ai/${url}`
  }

  const extractStatus = (payload: any) => {
    if (!payload || typeof payload !== 'object') return null
    if (typeof payload.message === 'string') return payload.message
    if (typeof payload.status === 'string') return payload.status
    if (typeof payload.error === 'string') return payload.error
    if (typeof payload.detail === 'string') return payload.detail
    return null
  }

  const parseCooldown = (payload: any) => {
    if (!payload || typeof payload !== 'object') return null
    const candidates = [
      payload.retryAfter,
      payload.retry_after,
      payload.cooldown,
      payload.wait,
      payload.nextClaimAt,
      payload.next_claim_at,
      payload.next_available_at,
      payload.next_available,
      payload.availableAt,
      payload.available_at,
    ]

    for (const value of candidates) {
      if (!value && value !== 0) continue
      if (typeof value === 'number' && Number.isFinite(value)) {
        if (value > 1e12) return new Date(value).toLocaleString()
        if (value > 1e9) return new Date(value * 1000).toLocaleString()
        if (value >= 0) {
          const mins = Math.round(value / 60)
          return mins > 0 ? `${mins} menit` : `${Math.round(value)} detik`
        }
      }
      if (typeof value === 'string' && value.trim()) {
        const parsed = Date.parse(value)
        if (!Number.isNaN(parsed)) return new Date(parsed).toLocaleString()
        return value
      }
    }

    const text = `${extractStatus(payload) || ''} ${JSON.stringify(payload)}`.toLowerCase()
    const timeMatch = text.match(/(\d+)\s*(minute|minutes|min|mins|hour|hours|hr|hrs|second|seconds|sec|secs|day|days)/)
    if (timeMatch) return `${timeMatch[1]} ${timeMatch[2]}`

    return null
  }

  const parseFaucetTxHash = (payload: any): string | null => {
    if (!payload || typeof payload !== 'object') return null

    const directCandidates = [
      payload.txHash,
      payload.tx_hash,
      payload.transactionHash,
      payload.transaction_hash,
      payload.hash,
      payload.data?.txHash,
      payload.data?.tx_hash,
      payload.data?.transactionHash,
      payload.data?.transaction_hash,
      payload.result?.txHash,
      payload.result?.transactionHash,
      payload.meta?.txHash,
      payload.meta?.transactionHash,
      payload.receipt?.transactionHash,
      payload.receipt?.hash,
      payload.claim?.txHash,
      payload.claim?.transactionHash,
    ]

    for (const candidate of directCandidates) {
      if (typeof candidate === 'string' && candidate.startsWith('0x') && candidate.length >= 66) {
        return candidate
      }
    }

    const searchPool = [
      payload,
      payload.data,
      payload.result,
      payload.meta,
      payload.receipt,
      payload.claim,
      payload.message,
      payload.status,
      payload.error,
    ]
      .filter(Boolean)
      .map((value) => (typeof value === 'string' ? value : JSON.stringify(value)))
      .join(' ')

    const hashMatch = searchPool.match(/0x[a-fA-F0-9]{64}/)
    return hashMatch ? hashMatch[0] : null
  }

  const resolveAmount = (payload: any): string | null => {
    const value = payload?.amount ?? payload?.data?.amount ?? payload?.result?.amount ?? payload?.claim?.amount
    if (typeof value === 'string' && value.trim()) return value
    if (typeof value === 'number' && Number.isFinite(value)) return `${value}`
    return null
  }

  const resolveAddress = (payload: any): string | null => {
    const value = payload?.address ?? payload?.walletAddress ?? payload?.wallet ?? payload?.to ?? payload?.recipient ?? payload?.data?.address
    if (typeof value === 'string' && value.startsWith('0x')) return value
    return null
  }

  const isLikelySuccess = (payload: any) => {
    if (!payload || typeof payload !== 'object') return false
    if (payload.success === true || payload.ok === true) return true
    const status = extractStatus(payload)?.toLowerCase() || ''
    if (status.includes('success') || status.includes('sent') || status.includes('completed') || status.includes('queued')) return true
    if (parseFaucetTxHash(payload)) return true
    return false
  }

  const handleRequestAccess = async () => {
    if (!address || requestingAccess) return
    try {
      setRequestingAccess(true)
      setRequestError(null)
      setRequestMessage(null)

      const res = await fetch('/api/v1/agentic-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'authorize', user: address }),
      })
      const data = await res.json()

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || data?.message || 'Failed to request access')
      }

      const txHash = data?.data?.txHash
      setRequestMessage(txHash
        ? `Access granted! Tx: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`
        : 'Access granted!')

      await checkAuth()
      await loadConfig()
    } catch (err: any) {
      setRequestError(err?.message || 'Failed to request access')
    } finally {
      setRequestingAccess(false)
    }
  }

  const handleClaimFaucet = async () => {
    if (!address || claimingFaucet) return

    setClaimingFaucet(true)
    setFaucetError(null)
    setFaucetTxHash(null)
    setFaucetAddress(null)
    setFaucetAmount(null)
    setFaucetCooldown(null)

    try {
      const targetAddress = normalizeAddress(address)

      const endpoints = [
        {
          url: 'https://faucet.0g.ai/api/faucet',
          body: { address: targetAddress },
        },
        {
          url: 'https://faucet.0g.ai/api/claim',
          body: { address: targetAddress },
        },
        {
          url: 'https://faucet.0g.ai/api/request',
          body: { address: targetAddress },
        },
        {
          url: 'https://faucet.0g.ai/api/faucet',
          body: { walletAddress: targetAddress },
        },
      ]

      let lastError: any = null
      let payload: any = null
      let success = false

      for (const endpointConfig of endpoints) {
        try {
          const res = await fetch(endpointConfig.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(endpointConfig.body),
          })

          const text = await res.text()
          let parsed: any = null
          try {
            parsed = text ? JSON.parse(text) : {}
          } catch {
            parsed = { message: text }
          }

          parsed = {
            ...parsed,
            _httpStatus: res.status,
            _ok: res.ok,
            _endpoint: endpointConfig.url,
            _requestBody: endpointConfig.body,
          }

          payload = parsed

          if (res.ok && isLikelySuccess(parsed)) {
            success = true
            break
          }

          const statusText = extractStatus(parsed)?.toLowerCase() || ''
          if (statusText.includes('already') || statusText.includes('wait') || statusText.includes('cooldown') || statusText.includes('too many')) {
            break
          }

          lastError = parsed
        } catch (endpointErr: any) {
          lastError = endpointErr
        }
      }

      if (!payload && lastError) {
        throw lastError
      }

      const txHash = parseFaucetTxHash(payload)
      const statusMessage = extractStatus(payload)
      const amount = resolveAmount(payload)
      const recipient = resolveAddress(payload) || targetAddress
      const cooldown = parseCooldown(payload)

      setFaucetAddress(recipient)
      setFaucetAmount(amount)
      setFaucetCooldown(cooldown)

      if (success || txHash) {
        setClaimedFaucet(true)
        if (txHash) setFaucetTxHash(txHash)
        if (!txHash && statusMessage && statusMessage.toLowerCase().includes('queued')) {
          setFaucetError(`Faucet queued: ${statusMessage}`)
        }
        return
      }

      const lowerMessage = (statusMessage || '').toLowerCase()
      if (cooldown || lowerMessage.includes('already') || lowerMessage.includes('wait') || lowerMessage.includes('cooldown') || lowerMessage.includes('too many')) {
        setFaucetError(cooldown
          ? `Faucet cooldown aktif. Coba lagi sekitar ${cooldown}.`
          : statusMessage || 'Faucet cooldown aktif. Coba lagi nanti.')
        setClaimedFaucet(false)
        return
      }

      throw new Error(statusMessage || 'Faucet request failed')
    } catch (err: any) {
      const message = typeof err?.message === 'string' ? err.message : 'Gagal claim faucet otomatis.'
      setFaucetError(message)
      setClaimedFaucet(false)
      setShowFaucetGuide(true)
    } finally {
      setClaimingFaucet(false)
    }
  }

  const profile: AgentProfile | null = config?.profile ?? null

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

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const explorerUrl = `https://chainscan-galileo.0g.ai/address/${AGENTIC_ID_CONTRACT_ADDRESS}`
  const tokenExplorerUrl = AGENTIC_ID_TOKEN_ID
    ? `https://chainscan-galileo.0g.ai/token/${AGENTIC_ID_CONTRACT_ADDRESS}/instance/${AGENTIC_ID_TOKEN_ID}`
    : null

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

      {/* ====== AGENT SPECIFICATION ====== */}
      {profile && (
        <Card className="bg-white/[0.04] backdrop-blur-md border-white/15 overflow-hidden">
          {/* Agent Identity Header */}
          <div className="px-6 py-4 border-b border-white/[0.08] bg-gradient-to-r from-accent-blue/10 to-purple-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-purple-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{profile.metadata.name}</h3>
                  <p className="text-xs text-white/40">Token #{profile.tokenId}</p>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                profile.hashVerified
                  ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                  : 'bg-red-500/15 text-red-400 border border-red-500/20'
              }`}>
                {profile.hashVerified ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                {profile.hashVerified ? 'Hash Verified' : 'Hash Mismatch'}
              </div>
            </div>
          </div>

          {/* Spec Grid */}
          <div className="p-6 grid grid-cols-2 gap-4">
            {/* Model */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-accent-blue" />
                <span className="text-xs text-white/40 uppercase tracking-wider">Model</span>
              </div>
              <p className="text-sm font-mono text-white/90">{profile.metadata.model}</p>
            </div>

            {/* Provider */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-white/40 uppercase tracking-wider">Provider</span>
              </div>
              <p className="text-sm font-mono text-white/90">{profile.metadata.provider}</p>
            </div>

            {/* Capabilities */}
            <div className="col-span-2 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-3">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-white/40 uppercase tracking-wider">Capabilities</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.metadata.capabilities.map((cap) => (
                  <span key={cap} className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Data Description */}
            {profile.intelligentData.length > 0 && (
              <div className="col-span-2 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-white/40 uppercase tracking-wider">On-Chain Description</span>
                </div>
                <p className="text-sm text-white/80">{profile.intelligentData[0].dataDescription}</p>
              </div>
            )}

            {/* Data Hash */}
            {profile.intelligentData.length > 0 && (
              <div className="col-span-2 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-white/40 uppercase tracking-wider">Data Hash (keccak256)</span>
                  </div>
                  <button
                    onClick={() => handleCopy(profile.intelligentData[0].dataHash, 'dataHash')}
                    className="text-white/30 hover:text-white/60 transition-colors"
                  >
                    {copiedField === 'dataHash' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <code className="text-xs font-mono text-cyan-300 break-all">{profile.intelligentData[0].dataHash}</code>
                {profile.knownHash && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-white/30">Computed:</span>
                    <code className="text-xs font-mono text-white/40">{profile.knownHash.slice(0, 18)}...{profile.knownHash.slice(-10)}</code>
                    {profile.hashVerified && <CheckCircle className="w-3.5 h-3.5 text-green-400" />}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* On-Chain Details */}
          <div className="px-6 pb-6 grid grid-cols-2 gap-4">
            {/* Owner */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-xs text-white/40 uppercase tracking-wider">Owner</span>
              <div className="flex items-center gap-2 mt-1.5">
                <code className="text-xs font-mono text-white/70">
                  {profile.owner.slice(0, 8)}...{profile.owner.slice(-6)}
                </code>
                <button
                  onClick={() => handleCopy(profile.owner, 'owner')}
                  className="text-white/30 hover:text-white/60 transition-colors"
                >
                  {copiedField === 'owner' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Creator */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-xs text-white/40 uppercase tracking-wider">Creator</span>
              <div className="flex items-center gap-2 mt-1.5">
                <code className="text-xs font-mono text-white/70">
                  {profile.creator.slice(0, 8)}...{profile.creator.slice(-6)}
                </code>
                <button
                  onClick={() => handleCopy(profile.creator, 'creator')}
                  className="text-white/30 hover:text-white/60 transition-colors"
                >
                  {copiedField === 'creator' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Authorized Users */}
            <div className="col-span-2 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-white/40 uppercase tracking-wider">
                  Authorized Users ({profile.authorizedUsers.length})
                </span>
              </div>
              {profile.authorizedUsers.length > 0 ? (
                <div className="space-y-1.5">
                  {profile.authorizedUsers.map((user) => (
                    <div key={user} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <code className="text-xs font-mono text-white/70">
                        {user.slice(0, 10)}...{user.slice(-8)}
                      </code>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/30">No authorized users yet</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* ====== CONTRACT INFO ====== */}
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
                onClick={() => handleCopy(AGENTIC_ID_CONTRACT_ADDRESS, 'contract')}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                {copiedField === 'contract' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              </button>
              <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors">
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Token ID</span>
            <div className="flex items-center gap-2">
              <code className="text-xs text-white/80 font-mono">{AGENTIC_ID_TOKEN_ID || 'Not configured'}</code>
              {tokenExplorerUrl && (
                <a href={tokenExplorerUrl} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors">
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Standard</span>
            <span className="text-xs text-white/80">ERC-7857 (Agentic ID)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Chain</span>
            <span className="text-xs text-white/80">0G Galileo Testnet (16602)</span>
          </div>
        </div>
      </Card>

      {/* ====== AUTHORIZATION STATUS ====== */}
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

          {/* Not authorized — show Request Access button */}
          {!authCheck.authorized && authCheck.enabled && (
            <div className="mt-3 space-y-3">
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-300">
                  Wallet not authorized to use SIFIX Agent.
                </p>
              </div>

              <button
                onClick={handleRequestAccess}
                disabled={requestingAccess}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-accent-blue to-purple-500 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {requestingAccess ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Requesting Access...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Request Access (Free)
                  </>
                )}
              </button>

              {requestMessage && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <p className="text-xs text-green-300">{requestMessage}</p>
                  </div>
                </div>
              )}
              {requestError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-xs text-red-300">{requestError}</p>
                </div>
              )}
            </div>
          )}

          {/* Authorized */}
          {authCheck.authorized && (
            <div className="mt-2 p-3 rounded-lg bg-accent-blue/10 border border-accent-blue/20">
              <p className="text-xs text-accent-blue">You can use SIFIX Agent to scan transactions.</p>
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

      {/* ====== FAUCET ====== */}
      <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white/80">0G Faucet</h3>
          <a
            href={faucetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-accent-blue hover:underline flex items-center gap-1"
          >
            Open Faucet
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Chain mismatch warning */}
        {hasMismatch && (
          <div className="mb-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />
              <p className="text-xs text-yellow-300">
                Chain config ({chainLabel}) does not match RPC endpoint ({endpoint}). Check your .env settings.
              </p>
            </div>
          </div>
        )}

        {/* RPC hint */}
        {faucetHint && !hasMismatch && (
          <div className="mb-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
            <p className="text-xs text-white/40">{faucetHint}</p>
          </div>
        )}

        <button
          onClick={handleClaimFaucet}
          disabled={claimingFaucet}
          className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white text-sm font-medium hover:bg-white/[0.1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {claimingFaucet ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Claiming...
            </>
          ) : claimedFaucet ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-400" />
              Claimed!
            </>
          ) : (
            <>
              Claim Testnet Tokens
            </>
          )}
        </button>

        {/* Faucet result */}
        {faucetTxHash && (
          <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-300 font-medium">Tokens sent!</span>
            </div>
            <div className="mt-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">TX:</span>
                <a
                  href={`${txExplorerBase}/${faucetTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-accent-blue hover:underline"
                >
                  {faucetTxHash.slice(0, 14)}...{faucetTxHash.slice(-8)}
                </a>
              </div>
              {faucetAddress && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40">To:</span>
                  <code className="text-xs font-mono text-white/60">{faucetAddress.slice(0, 10)}...{faucetAddress.slice(-6)}</code>
                </div>
              )}
              {faucetAmount && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/40">Amount:</span>
                  <span className="text-xs text-white/60">{faucetAmount}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Faucet error */}
        {faucetError && (
          <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-yellow-300">{faucetError}</p>
                {faucetCooldown && (
                  <p className="text-xs text-yellow-400/60 mt-1">Cooldown: {faucetCooldown}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Faucet guide fallback */}
        {showFaucetGuide && (
          <div className="mt-3 p-4 rounded-lg bg-white/[0.03] border border-white/[0.05]">
            <p className="text-xs text-white/60 mb-3">Auto-claim failed. Claim manually:</p>
            <ol className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-xs text-white/40 shrink-0">1.</span>
                <span className="text-xs text-white/50">Open{' '}
                  <a href={faucetUrl} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">
                    faucet.0g.ai
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xs text-white/40 shrink-0">2.</span>
                <span className="text-xs text-white/50">Paste your wallet address</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xs text-white/40 shrink-0">3.</span>
                <span className="text-xs text-white/50">Complete captcha + Request Tokens</span>
              </li>
            </ol>
            <div className="mt-3 p-2 rounded-lg bg-white/[0.03]">
              <p className="text-xs text-white/30 mb-1">Your address:</p>
              <div className="flex items-center gap-2">
                <code className="text-xs font-mono text-white/60 break-all">{address}</code>
                <button
                  onClick={() => handleCopy(address!, 'faucetAddr')}
                  className="text-white/30 hover:text-white/60 transition-colors shrink-0"
                >
                  {copiedField === 'faucetAddr' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* ====== 0G STACK ====== */}
      <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
        <h3 className="text-sm font-medium text-white/80 mb-4">0G Stack Integration</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Chain', status: true, desc: '0G Galileo Testnet' },
            { name: 'Compute', status: true, desc: profile?.metadata.model || 'AI Inference' },
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
