"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Shield, TrendingUp } from "lucide-react"

export default function LeaderboardPage() {
  // Mock data - replace with real data from API
  const topReporters = [
    {
      rank: 1,
      address: "0x1234...5678",
      reports: 156,
      accuracy: 98,
      reputation: 95,
      rewards: "2,450 A0GI",
    },
    {
      rank: 2,
      address: "0x9876...4321",
      reports: 143,
      accuracy: 96,
      reputation: 93,
      rewards: "2,180 A0GI",
    },
    {
      rank: 3,
      address: "0x5555...6666",
      reports: 138,
      accuracy: 94,
      reputation: 91,
      rewards: "2,050 A0GI",
    },
    {
      rank: 4,
      address: "0xabcd...efgh",
      reports: 125,
      accuracy: 92,
      reputation: 89,
      rewards: "1,890 A0GI",
    },
    {
      rank: 5,
      address: "0x1111...2222",
      reports: 118,
      accuracy: 90,
      reputation: 87,
      rewards: "1,720 A0GI",
    },
  ]

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
        <h2 className="text-2xl font-bold text-white mb-2">Security Leaderboard 🏆</h2>
        <p className="text-white/60">Top contributors protecting the 0G ecosystem</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">1,234</p>
              <p className="text-sm text-white/60">Total Reporters</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">5,678</p>
              <p className="text-sm text-white/60">Threats Reported</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">94.5%</p>
              <p className="text-sm text-white/60">Avg. Accuracy</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Leaderboard Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="text-left py-4 px-4 text-sm font-semibold text-white/60">Rank</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-white/60">Reporter</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-white/60">Reports</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-white/60">Accuracy</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-white/60">Reputation</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-white/60">Rewards</th>
              </tr>
            </thead>
            <tbody>
              {topReporters.map((reporter) => (
                <tr key={reporter.rank} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(reporter.rank)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-0g rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{reporter.address}</p>
                        <p className="text-sm text-white/40">Security Expert</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-white font-medium">{reporter.reports}</p>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={reporter.accuracy >= 95 ? "safe" : reporter.accuracy >= 90 ? "warning" : "danger"}>
                      {reporter.accuracy}%
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-white/[0.1] rounded-full h-2">
                        <div
                          className="bg-gradient-0g h-2 rounded-full"
                          style={{ width: `${reporter.reputation}%` }}
                        />
                      </div>
                      <span className="text-sm text-white/80">{reporter.reputation}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-[#4ecdc4] font-medium">{reporter.rewards}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Your Stats */}
      <Card className="bg-gradient-to-br from-[#ff6b6b]/10 to-[#4ecdc4]/10 border-[#ff6b6b]/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Your Position</h3>
            <p className="text-sm text-white/60">Keep reporting threats to climb the leaderboard!</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">#42</p>
            <p className="text-sm text-[#4ecdc4]">Top 4% of reporters</p>
          </div>
        </div>
      </Card>
    </div>
  )
}