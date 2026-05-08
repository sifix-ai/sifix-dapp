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
  Fingerprint,
  Cpu,
  Database,
  Globe,
  Users,
  FileCode,
  Hash,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [requestingAccess, setRequestingAccess] = useState(false)
  const [requestMessage, setRequestMessage] = useState<string | null>(null)
  const [requestError, setRequestError] = useState<string | null>(null)

  const profile: AgentProfile | null = config?.profile ?? null

  const loadConfig = useCallback(async () => {
    try {
      setStatus('loading')
      const res = await fetch('/api/v1/agentic-id')
      const data = await res.json()
      setConfig(data.success ? data.data : data)
      setStatus('success')
    } catch {
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
      setRequestMessage(
        txHash
          ? `Access granted! Tx: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`
          : 'Access granted!'
      )

      await checkAuth()
      await loadConfig()
    } catch (err: any) {
      setRequestError(err?.message || 'Failed to request access')
    } finally {
      setRequestingAccess(false)
    }
  }

  const explorerUrl = `https://chainscan-galileo.0g.ai/address/${AGENTIC_ID_CONTRACT_ADDRESS}`
  const tokenExplorerUrl = AGENTIC_ID_TOKEN_ID
    ? `https://chainscan-galileo.0g.ai/token/${AGENTIC_ID_CONTRACT_ADDRESS}/instance/${AGENTIC_ID_TOKEN_ID}`
    : null
  const faucetUrl = address ? `https://faucet.0g.ai/?address=${address}` : 'https://faucet.0g.ai'

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Fingerprint className="w-6 h-6 text-accent-blue" />
            Agentic ID
          </h2>
          <p className="text-white/50 text-sm mt-1">On-chain identity for SIFIX Agent (ERC-7857)</p>
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
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Fingerprint className="w-6 h-6 text-accent-blue" />
          Agentic ID
        </h2>
        <p className="text-white/50 text-sm mt-1">
          On-chain identity for SIFIX Agent (ERC-7857). Verifiable agent credentials on 0G Chain.
        </p>
      </div>

      {profile && (
        <Card className="bg-white/[0.04] backdrop-blur-md border-white/15 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.08] bg-gradient-to-r from-accent-blue/20 to-accent-blue/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent-blue" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-accent-blue">SIFIX Base Agent</h3>
                  <p className="text-xs text-accent-blue/80">Token #{profile.tokenId}</p>
                </div>
              </div>
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  profile.hashVerified
                    ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                    : 'bg-red-500/15 text-red-400 border border-red-500/20'
                }`}
              >
                {profile.hashVerified ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {profile.hashVerified ? 'Hash Verified' : 'Hash Mismatch'}
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-accent-blue" />
                <span className="text-xs text-white/40 uppercase tracking-wider">Model</span>
              </div>
              <p className="text-sm font-mono text-white/90">{profile.metadata.model}</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-accent-blue" />
                <span className="text-xs text-white/40 uppercase tracking-wider">Provider</span>
              </div>
              <p className="text-sm font-mono text-white/90">{profile.metadata.provider}</p>
            </div>

            <div className="col-span-2 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-3">
                <FileCode className="w-4 h-4 text-accent-blue" />
                <span className="text-xs text-white/40 uppercase tracking-wider">Capabilities</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.metadata.capabilities.map((cap) => (
                  <span key={cap} className="px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-medium">
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {profile.intelligentData.length > 0 && (
              <>
                <div className="col-span-2 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-accent-blue" />
                    <span className="text-xs text-white/40 uppercase tracking-wider">On-Chain Description</span>
                  </div>
                  <p className="text-sm text-white/80">{profile.intelligentData[0].dataDescription}</p>
                </div>

                <div className="col-span-2 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-accent-blue" />
                      <span className="text-xs text-white/40 uppercase tracking-wider">Data Hash (keccak256)</span>
                    </div>
                    <button onClick={() => handleCopy(profile.intelligentData[0].dataHash, 'dataHash')} className="text-white/30 hover:text-white/60">
                      {copiedField === 'dataHash' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <code className="text-xs font-mono text-accent-blue break-all">{profile.intelligentData[0].dataHash}</code>
                </div>
              </>
            )}
          </div>

          <div className="px-6 pb-6 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-xs text-white/40 uppercase tracking-wider">Owner</span>
              <div className="flex items-center gap-2 mt-1.5">
                <code className="text-xs font-mono text-white/70">{profile.owner.slice(0, 8)}...{profile.owner.slice(-6)}</code>
                <button onClick={() => handleCopy(profile.owner, 'owner')} className="text-white/30 hover:text-white/60">
                  {copiedField === 'owner' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-xs text-white/40 uppercase tracking-wider">Creator</span>
              <div className="flex items-center gap-2 mt-1.5">
                <code className="text-xs font-mono text-white/70">{profile.creator.slice(0, 8)}...{profile.creator.slice(-6)}</code>
                <button onClick={() => handleCopy(profile.creator, 'creator')} className="text-white/30 hover:text-white/60">
                  {copiedField === 'creator' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="col-span-2 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-accent-blue" />
                <span className="text-xs text-white/40 uppercase tracking-wider">Authorized Users ({profile.authorizedUsers.length})</span>
              </div>
              {profile.authorizedUsers.length > 0 ? (
                <div className="space-y-1.5">
                  {profile.authorizedUsers.map((user) => (
                    <div key={user} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <code className="text-xs font-mono text-white/70">{user.slice(0, 10)}...{user.slice(-8)}</code>
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

      <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
        <h3 className="text-sm font-medium text-white/60 mb-4">Contract Information</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Contract Address</span>
            <div className="flex items-center gap-2">
              <code className="text-xs text-accent-blue font-mono">
                {AGENTIC_ID_CONTRACT_ADDRESS.slice(0, 10)}...{AGENTIC_ID_CONTRACT_ADDRESS.slice(-8)}
              </code>
              <button onClick={() => handleCopy(AGENTIC_ID_CONTRACT_ADDRESS, 'contract')} className="text-white/30 hover:text-white/60">
                {copiedField === 'contract' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              </button>
              <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60">
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Token ID</span>
            <div className="flex items-center gap-2">
              <code className="text-xs text-white/80 font-mono">{AGENTIC_ID_TOKEN_ID || 'Not configured'}</code>
              {tokenExplorerUrl && (
                <a href={tokenExplorerUrl} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60">
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Chain</span>
            <span className="text-xs text-white/80">0G Galileo Testnet (16602)</span>
          </div>
        </div>
      </Card>

      {authCheck ? (
        <Card className={`bg-white/[0.04] backdrop-blur-md ${authCheck.authorized ? 'border-accent-blue/20' : 'border-red-500/20'}`}>
          <div className="flex items-center gap-3 mb-3">
            {authCheck.authorized ? <CheckCircle className="w-6 h-6 text-accent-blue" /> : <XCircle className="w-6 h-6 text-red-400" />}
            <div>
              <p className={`text-sm font-medium ${authCheck.authorized ? 'text-accent-blue' : 'text-red-400'}`}>
                {authCheck.authorized ? 'Authorized' : 'Not Authorized'}
              </p>
              <p className="text-xs text-white/40">{address?.slice(0, 8)}...{address?.slice(-6)}</p>
            </div>
          </div>

          {!authCheck.authorized && authCheck.enabled && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-300">Wallet not authorized to use SIFIX Agent.</p>
              </div>

              <Button
                onClick={handleRequestAccess}
                disabled={requestingAccess}
                className="w-full bg-accent-blue text-black hover:bg-accent-blue/90"
              >
                {requestingAccess ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Requesting Access...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Request Access (Free)
                  </>
                )}
              </Button>

              {requestMessage && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-xs text-green-300">{requestMessage}</p>
                </div>
              )}
              {requestError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-xs text-red-300">{requestError}</p>
                </div>
              )}
            </div>
          )}

          {authCheck.authorized && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-accent-blue/10 border border-accent-blue/20">
                <p className="text-xs text-accent-blue">You can use SIFIX Agent to scan transactions.</p>
              </div>
              <Button asChild variant="outline" className="w-full border-accent-blue/40 text-accent-blue hover:bg-accent-blue/10 hover:text-accent-blue">
                <a href={faucetUrl} target="_blank" rel="noopener noreferrer">
                  Open Faucet
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
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
