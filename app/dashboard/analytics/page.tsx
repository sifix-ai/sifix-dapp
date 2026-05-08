'use client';

import { TrendingUp, Activity, AlertTriangle, Shield, Users, Loader2 } from 'lucide-react';
import { useAnalyticsStats } from '@/hooks/use-analytics';
import { useLeaderboard } from '@/hooks/use-analytics';

export default function AnalyticsPage() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useAnalyticsStats();
  const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard(50);
  const loading = statsLoading || leaderboardLoading;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Platform Analytics</h2>
        <p className="text-white/60">Real-time statistics and top contributors</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Activity className="w-6 h-6 text-white/40 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Grid */}
          {stats && (
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#55b3ff]/10 border border-[#55b3ff]/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#55b3ff]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.totalAddresses}</div>
                    <div className="text-xs text-white/60">Addresses</div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#FF6363]/10 border border-[#FF6363]/20 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-[#FF6363]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.totalReports}</div>
                    <div className="text-xs text-white/60">Threat Reports</div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#5fc992]/10 border border-[#5fc992]/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-[#5fc992]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.totalScans}</div>
                    <div className="text-xs text-white/60">TX Scans</div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stats.criticalThreats}</div>
                    <div className="text-xs text-white/60">Critical</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard */}
          <div className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-xl">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-white" />
              <h2 className="text-xl font-semibold text-white">Top Reporters</h2>
            </div>

            {!leaderboard || leaderboard.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                No reporters yet
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((reporter: any, index: number) => (
                  <div
                    key={reporter.address || index}
                    className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.05] rounded-lg hover:border-white/[0.1] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        index === 1 ? 'bg-gray-400/10 text-gray-400 border border-gray-400/20' :
                        index === 2 ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                        'bg-white/5 text-white/60 border border-white/10'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <div className="text-white font-mono text-sm">
                          {reporter.address ? `${reporter.address.slice(0, 10)}...${reporter.address.slice(-8)}` : 'Unknown'}
                        </div>
                        <div className="text-xs text-white/40">
                          {reporter.reportCount ?? reporter.reportsSubmitted ?? 0} reports
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{reporter.totalScore ?? reporter.reporterScore ?? 0}</div>
                      <div className="text-xs text-white/40">reputation</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Risk Distribution */}
          <div className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-6">Risk Distribution</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg">
                <div className="text-2xl font-bold text-red-400 mb-1">
                  {stats?.criticalThreats || 0}
                </div>
                <div className="text-sm text-white/60">Critical</div>
              </div>
              <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-lg">
                <div className="text-2xl font-bold text-orange-400 mb-1">0</div>
                <div className="text-sm text-white/60">High</div>
              </div>
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-lg">
                <div className="text-2xl font-bold text-yellow-400 mb-1">0</div>
                <div className="text-sm text-white/60">Medium</div>
              </div>
              <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-lg">
                <div className="text-2xl font-bold text-green-400 mb-1">0</div>
                <div className="text-sm text-white/60">Low</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
