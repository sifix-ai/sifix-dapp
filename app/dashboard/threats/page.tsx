'use client'

import { useThreats } from '@/hooks/use-threats'
import { useAccount } from 'wagmi'
import { AlertTriangle, Shield, Clock, TrendingUp, Filter, Search } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { useState } from 'react'
import { Card } from '@/components/ui/card'

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
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-accent-blue" />
            Threat Intelligence
          </h2>
          <p className="text-white/60">Real-time threat feed from the 0G network</p>
        </div>

        <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
          <div className="p-12 text-center">
            <Shield className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">Connect your wallet to view threat intelligence feed</p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-accent-blue" />
            Threat Intelligence
          </h2>
          <p className="text-white/50 text-sm mt-1">
            Real-time threat feed from the 0G network
          </p>
        </div>
        {data && (
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Shield className="w-3.5 h-3.5" />
            {data.total} threats tracked
          </div>
        )}
      </div>

      {/* Stats Overview */}
      {data && data.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue/80 to-accent-blue flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/40">Total Threats</p>
                <p className="text-xl font-bold text-white">{data?.total || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/40">Critical</p>
                <p className="text-xl font-bold text-white">
                  {data?.reports?.filter((r: any) => r.riskLevel === 'CRITICAL').length || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/40">High</p>
                <p className="text-xl font-bold text-white">
                  {data?.reports?.filter((r: any) => r.riskLevel === 'HIGH').length || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/40">Medium</p>
                <p className="text-xl font-bold text-white">
                  {data?.reports?.filter((r: any) => r.riskLevel === 'MEDIUM').length || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      {data && data.total > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by address..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm text-white placeholder:text-white/20 outline-none focus:border-accent-blue/40 transition-all"
          />
        </div>
      )}

      {data && data.total > 0 && (
        <Card className="bg-white/[0.04] backdrop-blur-md border-white/15 p-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/40" />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="flex-1 bg-black/40 border border-white/[0.12] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all cursor-pointer text-white"
            >
              <option value="all">All Severity</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white/40 text-sm">Loading threats...</p>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
          <div className="p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-400 mb-2">Failed to Load Threats</h3>
            <p className="text-white/60">{error.message || 'Something went wrong'}</p>
          </div>
        </Card>
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
            <Card
              key={threat.id}
              className="group bg-white/[0.04] backdrop-blur-md border-white/15 hover:border-white/20 transition-all duration-200 p-6"
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

                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${threat.status === 'VERIFIED' ? 'bg-green-500/20 text-green-400' :
                    threat.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-white/10 text-white/60'
                    }`}>
                    {threat.status}
                  </div>
                  <div className={`px-2 py-1 rounded text-[11px] font-medium ${threat.localStatus === 'SYNCED' ? 'bg-blue-500/20 text-blue-300' :
                    threat.localStatus === 'RELAY_FAILED' ? 'bg-red-500/20 text-red-300' :
                      'bg-white/10 text-white/60'
                    }`}>
                    {threat.localStatus || 'PENDING_LOCAL'}
                  </div>
                  <div className="px-2 py-1 rounded text-[11px] font-medium bg-purple-500/20 text-purple-300">
                    {threat.onchainStatus || 'NONE'}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
