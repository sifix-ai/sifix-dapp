'use client'

import { AuthGuard } from '@/components/auth-guard'
import { useThreats } from '@/hooks/use-api'
import { ConnectButton } from '@/components/connect-button'
import { useAccount } from 'wagmi'
import { AlertTriangle, Shield, Clock, TrendingUp, Filter, Search } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { useState } from 'react'

export default function ThreatsPage() {
  const { isConnected } = useAccount()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')

  const { data, isLoading, error } = useThreats()

  // Filter threats
  const filteredThreats = data?.reports?.filter((threat: any) => {
    const matchesSearch = threat.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSeverity = filterSeverity === 'all' || threat.riskLevel === filterSeverity
    return matchesSearch && matchesSeverity
  }) || []

  // Wallet not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#07080a] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF6363]/20 to-[#55b3ff]/20 border border-white/[0.08] rounded-3xl flex items-center justify-center mb-6 mx-auto backdrop-blur-xl">
            <Shield className="w-10 h-10 text-[#FF6363]" />
          </div>

          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-white/60 mb-8">
            Connect your wallet to view threat intelligence feed.
          </p>

          <div className="flex justify-center">
            <ConnectButton />
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
                <AlertTriangle className="w-5 h-5 text-[#FF6363]" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Threat Intelligence</h1>
                <p className="text-xs text-white/40">Real-time threat feed</p>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.04] border border-white/[0.08] rounded-xl p-4 backdrop-blur-xl">
              <div className="text-xs text-white/40 mb-1 uppercase tracking-wider">Total Threats</div>
              <div className="text-2xl font-bold">{data?.total || 0}</div>
            </div>

            <div className="bg-gradient-to-b from-red-500/[0.08] to-red-500/[0.04] border border-red-500/[0.2] rounded-xl p-4 backdrop-blur-xl">
              <div className="text-xs text-red-400/60 mb-1 uppercase tracking-wider">Critical</div>
              <div className="text-2xl font-bold text-red-400">
                {data?.reports?.filter((r: any) => r.riskLevel === 'CRITICAL').length || 0}
              </div>
            </div>

            <div className="bg-gradient-to-b from-orange-500/[0.08] to-orange-500/[0.04] border border-orange-500/[0.2] rounded-xl p-4 backdrop-blur-xl">
              <div className="text-xs text-orange-400/60 mb-1 uppercase tracking-wider">High</div>
              <div className="text-2xl font-bold text-orange-400">
                {data?.reports?.filter((r: any) => r.riskLevel === 'HIGH').length || 0}
              </div>
            </div>

            <div className="bg-gradient-to-b from-yellow-500/[0.08] to-yellow-500/[0.04] border border-yellow-500/[0.2] rounded-xl p-4 backdrop-blur-xl">
              <div className="text-xs text-yellow-400/60 mb-1 uppercase tracking-wider">Medium</div>
              <div className="text-2xl font-bold text-yellow-400">
                {data?.reports?.filter((r: any) => r.riskLevel === 'MEDIUM').length || 0}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.04] border border-white/[0.08] rounded-xl p-4 backdrop-blur-xl mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by address..."
                  className="w-full bg-black/40 border border-white/[0.12] rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#FF6363] focus:ring-2 focus:ring-[#FF6363]/20 transition-all placeholder:text-white/30"
                />
              </div>

              {/* Severity Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-white/40" />
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="bg-black/40 border border-white/[0.12] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#FF6363] focus:ring-2 focus:ring-[#FF6363]/20 transition-all cursor-pointer"
                >
                  <option value="all">All Severity</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-gradient-to-b from-white/[0.08] to-white/[0.04] border border-white/[0.08] rounded-xl p-6 backdrop-blur-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-red-400 mb-2">Failed to Load Threats</h3>
              <p className="text-white/60">{error.message || 'Something went wrong'}</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredThreats.length === 0 && (
            <EmptyState
              icon={AlertTriangle}
              title={searchQuery || filterSeverity !== 'all' ? 'No Threats Found' : 'No Threats Yet'}
              description={
                searchQuery || filterSeverity !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No threat reports have been submitted yet. Start scanning addresses to build the threat database.'
              }
            />
          )}

          {/* Threats List */}
          {!isLoading && !error && filteredThreats.length > 0 && (
            <div className="space-y-4">
              {filteredThreats.map((threat: any) => (
                <div
                  key={threat.id}
                  className="group relative bg-gradient-to-b from-white/[0.08] to-white/[0.04] border border-white/[0.08] rounded-xl p-6 backdrop-blur-xl hover:border-white/[0.16] transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-2 h-2 rounded-full ${threat.riskLevel === 'CRITICAL' ? 'bg-red-500' :
                            threat.riskLevel === 'HIGH' ? 'bg-orange-500' :
                              threat.riskLevel === 'MEDIUM' ? 'bg-yellow-500' :
                                'bg-green-500'
                          } animate-pulse`} />
                        <h3 className="font-mono text-sm text-white/80 group-hover:text-white transition-colors">
                          {threat.address}
                        </h3>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-white/40">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(threat.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Confidence: {threat.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider ${threat.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        threat.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          threat.riskLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                      {threat.riskLevel}
                    </div>
                  </div>

                  <div className="bg-black/40 border border-white/[0.08] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-xs text-white/40 uppercase tracking-wider font-semibold">Threat Type</div>
                      <div className="text-xs font-medium text-white/80">{threat.threatType}</div>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {threat.explanation}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <span>Severity: <span className="text-white/80 font-medium">{threat.severity}/100</span></span>
                    </div>

                    <div className={`px-2 py-1 rounded text-xs font-medium ${threat.status === 'VERIFIED' ? 'bg-green-500/20 text-green-400' :
                        threat.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-white/10 text-white/60'
                      }`}>
                      {threat.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
