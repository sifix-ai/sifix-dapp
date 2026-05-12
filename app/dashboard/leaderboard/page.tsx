"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Shield, TrendingUp, Loader2 } from "lucide-react"
import { useLeaderboard } from "@/hooks/use-analytics"
import { useDashboardStats } from "@/hooks/use-dashboard"
import { useAccount } from "wagmi"

export default function LeaderboardPage() {
  const { address, isConnected } = useAccount()
  const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard(50)
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const loading = leaderboardLoading || statsLoading

  const avgAccuracy = (leaderboard && leaderboard.length > 0)
    ? Math.round(
        leaderboard.reduce((sum: number, r: any) => sum + (r.accuracyScore ?? 0), 0) / leaderboard.length
      )
    : null

  const myRankIndex = isConnected && address
    ? (leaderboard || []).findIndex((r: any) => r.address?.toLowerCase() === address.toLowerCase())
    : -1

  const myRank = myRankIndex >= 0 ? myRankIndex + 1 : null
  const percentile = myRank && leaderboard?.length
    ? Math.max(1, Math.round((myRank / leaderboard.length) * 100))
    : null

  const getReporterTier = (score: number) => {
    if (score >= 90) return "Elite"
    if (score >= 75) return "Advanced"
    if (score >= 50) return "Contributor"
    return "New"
  }

  const topReporters = (leaderboard || []).map((reporter: any, index: number) => ({
    rank: index + 1,
    address: reporter.address
      ? `${reporter.address.slice(0, 6)}...${reporter.address.slice(-4)}`
      : "Unknown",
    reports: reporter.reportsSubmitted ?? 0,
    verified: reporter.reportsVerified ?? 0,
    accuracy: reporter.accuracyScore ?? 0,
    reputation: reporter.overallScore ?? 0,
    reporterScore: reporter.reporterScore ?? 0,
  }))

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-white/60">#{rank}</span>
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-accent-blue" />
          Security Leaderboard
        </h2>
        <p className="text-white/60">Top contributors protecting the 0G ecosystem</p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-accent-blue/80 to-accent-blue rounded-xl">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.totalAddresses?.toLocaleString() ?? "—"}</p>
                  <p className="text-sm text-white/60">Total Reporters</p>
                </div>
              </div>
            </Card>
            <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-accent-blue/70 to-accent-blue/90 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats?.totalReports?.toLocaleString() ?? "—"}</p>
                  <p className="text-sm text-white/60">Threats Reported</p>
                </div>
              </div>
            </Card>
            <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-accent-blue to-accent-blue/80 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{avgAccuracy !== null ? `${avgAccuracy}%` : "—"}</p>
                  <p className="text-sm text-white/60">Avg. Accuracy</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Leaderboard Table */}
          <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/15">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-white/60">Rank</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-white/60">Reporter</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-white/60">Reports</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-white/60">Verified</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-white/60">Accuracy</th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-white/60">Reputation</th>
                  </tr>
                </thead>
                <tbody>
                  {topReporters.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-white/40">
                        No reporters yet
                      </td>
                    </tr>
                  ) : (
                    topReporters.map((reporter) => (
                      <tr key={reporter.rank} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {getRankIcon(reporter.rank)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-accent-blue/80 to-accent-blue rounded-full flex items-center justify-center">
                              <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{reporter.address}</p>
                              <p className="text-sm text-white/40">{getReporterTier(reporter.reporterScore)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-white font-medium">{reporter.reports}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-white font-medium">{reporter.verified}</p>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={reporter.accuracy >= 90 ? "safe" : reporter.accuracy >= 70 ? "warning" : "danger"}>
                            {reporter.accuracy}%
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-white/[0.1] rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-accent-blue/70 to-accent-blue h-2 rounded-full"
                                style={{ width: `${Math.min(reporter.reputation, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm text-white/80">{reporter.reputation}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Your Stats */}
          {isConnected && (
            <Card className="bg-gradient-to-br from-accent-blue/10 to-accent-blue/5 border-accent-blue/20 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Your Position</h3>
                  <p className="text-sm text-white/60">
                    {myRank ? "Keep reporting threats to climb the leaderboard!" : "Start reporting threats to appear on the leaderboard!"}
                  </p>
                </div>
                <div className="text-right">
                  {myRank ? (
                    <>
                      <p className="text-3xl font-bold text-white">#{myRank}</p>
                      <p className="text-sm text-accent-blue">Top {percentile}% of reporters</p>
                    </>
                  ) : (
                    <p className="text-lg font-medium text-white/40">Not ranked yet</p>
                  )}
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
