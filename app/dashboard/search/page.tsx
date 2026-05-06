'use client'

import { AuthGuard } from '@/components/auth-guard'
import { useScanAddress, useAddressReputation } from '@/hooks/use-api'
import { useAppStore } from '@/store/app-store'
import { useState } from 'react'
import { addressSchema } from '@/lib/validations'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { Search, Shield, AlertTriangle, TrendingUp, Sparkles, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { EmptyState } from '@/components/ui/empty-state'

export default function SearchPage() {
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const { addNotification } = useAppStore()
  const { isConnected } = useAccount()
  
  const scanMutation = useScanAddress()
  const { data: reputation, isLoading: reputationLoading } = useAddressReputation(
    (scanMutation.data as any)?.address
  )

  const handleScan = async () => {
    try {
      setError('')
      addressSchema.parse(address)
      await scanMutation.mutateAsync({ address })
      addNotification({
        type: 'success',
        message: 'Address scanned successfully',
      })
    } catch (err: any) {
      const errorMsg = err.message || 'Invalid address format'
      setError(errorMsg)
      addNotification({
        type: 'error',
        message: errorMsg,
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !scanMutation.isPending) {
      handleScan()
    }
  }

  // Helper to render loading state
  const renderLoadingState = (): React.ReactElement | null => {
    if (!scanMutation.isPending) return null
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.04] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-xl">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-black/40 rounded-xl p-4">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Wallet not connected state
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#07080a] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF6363]/20 to-[#55b3ff]/20 border border-white/[0.08] rounded-3xl flex items-center justify-center mb-6 mx-auto backdrop-blur-xl">
            <Shield className="w-10 h-10 text-[#FF6363]" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Connect Your Wallet
          </h1>
          
          <p className="text-white/60 mb-8 leading-relaxed">
            Connect your Web3 wallet to start scanning addresses and accessing threat intelligence.
          </p>
          
          <div className="flex justify-center">
            <ConnectButton />
          </div>
          
          <div className="mt-12 p-6 bg-white/[0.02] border border-white/[0.08] rounded-2xl backdrop-blur-sm">
            <div className="flex items-start gap-3 text-left">
              <Sparkles className="w-5 h-5 text-[#FF6363] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Why connect?</h3>
                <p className="text-sm text-white/60">
                  Your wallet connection enables on-chain reputation verification and secure threat reporting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#07080a] text-white">
        {/* Header */}
        <div className="border-b border-white/[0.08] bg-[#07080a]/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF6363]/20 to-[#55b3ff]/20 border border-white/[0.08] rounded-xl flex items-center justify-center backdrop-blur-xl">
                <Search className="w-5 h-5 text-[#FF6363]" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Address Scanner</h1>
                <p className="text-xs text-white/40">AI-powered threat detection</p>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Form */}
          <div className="mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF6363]/20 to-[#55b3ff]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.04] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-xl">
                <label className="block text-sm font-medium mb-3 text-white/80">
                  Ethereum Address or ENS Name
                </label>
                
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="0x... or vitalik.eth"
                      disabled={scanMutation.isPending}
                      className="w-full bg-black/40 border border-white/[0.12] rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#FF6363] focus:ring-2 focus:ring-[#FF6363]/20 transition-all duration-200 placeholder:text-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {address && !error && (
                      <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                    {error && (
                      <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                    )}
                  </div>
                  
                  <button
                    onClick={handleScan}
                    disabled={scanMutation.isPending || !address}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#FF6363] to-[#FF6363]/80 hover:from-[#FF6363]/90 hover:to-[#FF6363]/70 disabled:from-white/[0.08] disabled:to-white/[0.08] disabled:text-white/40 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#FF6363]/20 disabled:shadow-none"
                  >
                    {scanMutation.isPending ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>Scanning...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>Scan</span>
                      </>
                    )}
                  </button>
                </div>
                
                {error && (
                  <div className="mt-3 flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                
                <div className="mt-4 flex items-center gap-4 text-xs text-white/40">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>AI Agent Active</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>&lt;100ms Response</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {(() => {
            if (!scanMutation.isPending) return null
            return (
              <div className="space-y-6">
                <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.04] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-xl">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-black/40 rounded-xl p-4">
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Empty State */}
          {!scanMutation.data && !scanMutation.isPending && (
            <EmptyState
              icon={Search}
              title="No Results Yet"
              description="Enter an Ethereum address or ENS name above to scan for threats and view reputation data."
              action={{
                label: "Try Example Address",
                onClick: () => setAddress("0x1234567890123456789012345678901234567890")
              }}
            />
          )}

          {/* Scan Results */}
          {scanMutation.data && !scanMutation.isPending && (
            <div className="space-y-6">
              {/* Risk Overview */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF6363]/10 to-[#55b3ff]/10 rounded-2xl blur-xl opacity-50" />
                
                <div className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.04] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FF6363]/20 to-[#55b3ff]/20 border border-white/[0.08] rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[#FF6363]" />
                    </div>
                    <h2 className="text-xl font-bold">Risk Analysis</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Risk Level */}
                    <div className="bg-black/40 border border-white/[0.08] rounded-xl p-4 hover:border-white/[0.16] transition-colors">
                      <div className="text-xs text-white/40 mb-2 uppercase tracking-wider">Risk Level</div>
                      <div className={`text-2xl font-bold ${
                        (scanMutation.data as any).riskLevel === 'CRITICAL' ? 'text-red-500' :
                        (scanMutation.data as any).riskLevel === 'HIGH' ? 'text-orange-500' :
                        (scanMutation.data as any).riskLevel === 'MEDIUM' ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {(scanMutation.data as any).riskLevel || 'LOW'}
                      </div>
                    </div>
                    
                    {/* Risk Score */}
                    <div className="bg-black/40 border border-white/[0.08] rounded-xl p-4 hover:border-white/[0.16] transition-colors">
                      <div className="text-xs text-white/40 mb-2 uppercase tracking-wider">Risk Score</div>
                      <div className="text-2xl font-bold">{(scanMutation.data as any).riskScore}<span className="text-white/40 text-lg">/100</span></div>
                    </div>
                    
                    {/* Threat Count */}
                    <div className="bg-black/40 border border-white/[0.08] rounded-xl p-4 hover:border-white/[0.16] transition-colors">
                      <div className="text-xs text-white/40 mb-2 uppercase tracking-wider">Threats Detected</div>
                      <div className="text-2xl font-bold">{(scanMutation.data as any).threatCount}</div>
                    </div>
                    
                    {/* Recommendation */}
                    <div className="bg-black/40 border border-white/[0.08] rounded-xl p-4 hover:border-white/[0.16] transition-colors">
                      <div className="text-xs text-white/40 mb-2 uppercase tracking-wider">Action</div>
                      <div className="text-lg font-bold truncate">
                        {(scanMutation.data as any).analysis?.recommendation || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* AI Analysis */}
                  <div className="mt-6 bg-black/40 border border-white/[0.08] rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-[#FF6363]" />
                      <div className="text-xs text-white/60 uppercase tracking-wider font-semibold">AI Analysis</div>
                    </div>
                      <p className="text-white/80 leading-relaxed">
                        {(scanMutation.data as any).analysis?.recommendation || 'N/A'}
                      </p>
                  </div>
                </div>
              </div>

              {/* Reputation Data */}
              {reputationLoading && (
                <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.04] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-xl">
                  <Skeleton className="h-6 w-40 mb-4" />
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-black/40 rounded-xl p-4">
                        <Skeleton className="h-4 w-16 mb-2" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reputation && !reputationLoading && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#55b3ff]/10 to-[#5fc992]/10 rounded-2xl blur-xl opacity-50" />
                  
                  <div className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.04] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#55b3ff]/20 to-[#5fc992]/20 border border-white/[0.08] rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-[#55b3ff]" />
                      </div>
                      <h2 className="text-xl font-bold">On-Chain Reputation</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-black/40 border border-white/[0.08] rounded-xl p-4 hover:border-white/[0.16] transition-colors">
                        <div className="text-xs text-white/40 mb-2 uppercase tracking-wider">Reputation Score</div>
                        <div className="text-2xl font-bold">{(reputation as any).score}<span className="text-white/40 text-lg">/100</span></div>
                      </div>
                      
                      <div className="bg-black/40 border border-white/[0.08] rounded-xl p-4 hover:border-white/[0.16] transition-colors">
                        <div className="text-xs text-white/40 mb-2 uppercase tracking-wider">Total Reports</div>
                        <div className="text-2xl font-bold">{(reputation as any).reportCount}</div>
                      </div>
                      
                      <div className="bg-black/40 border border-white/[0.08] rounded-xl p-4 hover:border-white/[0.16] transition-colors">
                        <div className="text-xs text-white/40 mb-2 uppercase tracking-wider">Last Updated</div>
                        <div className="text-sm font-medium">
                          {(reputation as any).lastUpdate ? new Date((reputation as any).lastUpdate).toLocaleDateString() : 'Never'}
                        </div>
                      </div>
                    </div>

                    {(reputation as any).reports && (reputation as any).reports.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3 text-white/80">Recent Reports</h3>
                        <div className="space-y-2">
                          {(reputation as any).reports.map((report: any, i: number) => (
                            <div key={i} className="bg-black/40 border border-white/[0.08] rounded-xl p-4 hover:border-white/[0.16] transition-colors">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${
                                    report.severity > 80 ? 'bg-red-500' :
                                    report.severity > 50 ? 'bg-orange-500' :
                                    'bg-yellow-500'
                                  }`} />
                                  <span className="text-sm text-white/60">Severity: <span className="text-white font-medium">{report.severity}</span></span>
                                </div>
                                <span className="text-xs text-white/40">
                                  {new Date(report.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
