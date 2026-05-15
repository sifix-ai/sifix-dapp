"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi"
import { useLeaderboard } from "@/hooks/use-analytics"
import {
  Coins,
  Lock,
  FileText,
  TrendingUp,
  CheckCircle,
  XCircle,
  Loader2,
  Medal,
  Trophy,
  Wallet,
  X,
  ArrowRight,
  Zap,
} from "lucide-react"

const howItWorks = [
  {
    step: 1,
    icon: Coins,
    title: "Acquire SIFIX",
    desc: "Get SIFIX tokens via a DEX or earn them by contributing verified threat reports to the community.",
    color: "text-accent-yellow",
    bg: "bg-accent-yellow/10",
  },
  {
    step: 2,
    icon: Lock,
    title: "Stake Tokens",
    desc: "Lock your SIFIX to establish credibility. Your stake size determines your reporting weight and reward multiplier.",
    color: "text-accent-blue",
    bg: "bg-accent-blue/10",
  },
  {
    step: 3,
    icon: FileText,
    title: "Submit Reports",
    desc: "Submit threat intelligence from wallet scans, transaction analysis, or community tips to the on-chain feed.",
    color: "text-accent-green",
    bg: "bg-accent-green/10",
  },
  {
    step: 4,
    icon: TrendingUp,
    title: "Earn or Get Slashed",
    desc: "Community-verified reports earn proportional SIFIX rewards. False or spam reports result in stake slashing.",
    color: "text-accent-orange",
    bg: "bg-accent-orange/10",
  },
]

const placeholderStats = [
  { label: "Total Staked", value: "—", sub: "SIFIX" },
  { label: "Active Reporters", value: "—", sub: "stakers" },
  { label: "Avg APY", value: "—", sub: "estimated" },
  { label: "Slash Events", value: "—", sub: "last 30d" },
]

export default function StakingPage() {
  const { isConnected } = useAccount()
  const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard(10)
  const [stakeModalOpen, setStakeModalOpen] = useState(false)
  const [notifyEmail, setNotifyEmail] = useState("")
  const [notifySubmitted, setNotifySubmitted] = useState(false)

  const topReporters = (leaderboard || []).map((r: any, i: number) => ({
    rank: i + 1,
    address: r.address
      ? `${r.address.slice(0, 6)}...${r.address.slice(-4)}`
      : "Unknown",
    reports: r.reportsSubmitted ?? 0,
    accuracy: r.accuracyScore ?? 0,
    score: r.overallScore ?? 0,
  }))

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal className="w-5 h-5 text-yellow-400" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />
    return <span className="text-sm text-white/40 font-mono">#{rank}</span>
  }

  return (
    <>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Coins className="w-6 h-6 text-accent-yellow" />
                Reputation Staking Economy
              </h2>
              <Badge className="bg-accent-yellow/15 text-accent-yellow border-accent-yellow/20 text-xs">
                Coming Soon
              </Badge>
            </div>
            <p className="text-white/60">
              Stake SIFIX tokens to unlock reporting rights and earn rewards for verified threat intelligence.
            </p>
          </div>
          <Button
            onClick={() => setStakeModalOpen(true)}
            className="bg-accent-yellow/20 border border-accent-yellow/30 text-accent-yellow hover:bg-accent-yellow/30 gap-2 font-medium"
          >
            <Zap className="w-4 h-4" />
            Stake Tokens
          </Button>
        </div>

        {/* Placeholder Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {placeholderStats.map((stat) => (
            <Card key={stat.label} className="bg-white/[0.04] border-white/10 backdrop-blur-md p-4">
              <p className="text-2xl font-bold text-white mb-0.5">{stat.value}</p>
              <p className="text-xs text-white/40">{stat.sub}</p>
              <p className="text-sm text-white/60 mt-1">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-accent-yellow rounded-full inline-block" />
            How It Works
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {howItWorks.map((item) => (
              <Card
                key={item.step}
                className="bg-white/[0.04] border-white/10 backdrop-blur-md p-5 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-white/25">0{item.step}</span>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Earn / Slash */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="bg-accent-green/[0.05] border-accent-green/15 p-5">
            <CheckCircle className="w-6 h-6 text-accent-green mb-3" />
            <h4 className="text-base font-semibold text-white mb-1">Valid Report → Earn</h4>
            <p className="text-sm text-white/60">
              Reports verified by sufficient community votes earn proportional SIFIX rewards. Higher stake = higher multiplier.
            </p>
          </Card>
          <Card className="bg-accent-red/[0.05] border-accent-red/15 p-5">
            <XCircle className="w-6 h-6 text-accent-red mb-3" />
            <h4 className="text-base font-semibold text-white mb-1">False Report → Slashed</h4>
            <p className="text-sm text-white/60">
              Reports rejected by the community result in a proportional slash of your staked SIFIX, deterring spam and bad actors.
            </p>
          </Card>
        </div>

        {/* Your Position + Leaderboard */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Your Staking Position */}
          <Card className="bg-white/[0.04] border-white/10 backdrop-blur-md p-6">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-accent-blue" />
              Your Staking Position
            </h3>
            {isConnected ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-accent-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-7 h-7 text-accent-yellow/60" />
                </div>
                <p className="text-white/60 text-sm mb-4">
                  Staking contract not yet deployed. You&apos;ll be able to stake SIFIX tokens once the contract goes live.
                </p>
                <Button
                  onClick={() => setStakeModalOpen(true)}
                  className="bg-accent-yellow/15 border border-accent-yellow/25 text-accent-yellow hover:bg-accent-yellow/25 text-sm gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Get Notified at Launch
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Wallet className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="text-white/40 text-sm">Connect wallet to view your staking position</p>
              </div>
            )}
          </Card>

          {/* Live Reporter Leaderboard */}
          <Card className="bg-white/[0.04] border-white/10 backdrop-blur-md p-6">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-accent-blue" />
              Top Reporters
              <Badge className="bg-accent-green/10 text-accent-green border-accent-green/20 text-xs ml-auto">
                Live
              </Badge>
            </h3>
            {leaderboardLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-5 h-5 text-white/30 animate-spin" />
              </div>
            ) : topReporters.length === 0 ? (
              <p className="text-white/40 text-sm text-center py-10">No reporters yet</p>
            ) : (
              <div className="space-y-2">
                {topReporters.map((r) => (
                  <div
                    key={r.rank}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                  >
                    <div className="w-8 flex items-center justify-center flex-shrink-0">
                      {getRankIcon(r.rank)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono text-white/80 truncate">{r.address}</p>
                      <p className="text-xs text-white/40">
                        {r.reports} reports · {r.accuracy}% accuracy
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-white">{r.score}</p>
                      <p className="text-xs text-white/40">score</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Stake Modal — Coming Soon */}
      {stakeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setStakeModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#0a0a0c] border border-white/15 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setStakeModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-accent-yellow/10 rounded-2xl flex items-center justify-center mb-5">
              <Coins className="w-7 h-7 text-accent-yellow" />
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">Staking Contract In Progress</h3>
            <p className="text-sm text-white/60 mb-5">
              The SIFIX staking contract is currently under development. Enter your email to be notified the moment staking goes live — early stakers will receive a bonus multiplier.
            </p>

            {notifySubmitted ? (
              <div className="flex items-center gap-3 px-4 py-3 bg-accent-green/10 border border-accent-green/20 rounded-xl">
                <CheckCircle className="w-5 h-5 text-accent-green flex-shrink-0" />
                <p className="text-sm text-accent-green">You&apos;re on the list. We&apos;ll notify you at launch.</p>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent-yellow/30 transition-colors"
                />
                <Button
                  onClick={() => {
                    if (notifyEmail.includes("@")) setNotifySubmitted(true)
                  }}
                  className="bg-accent-yellow/20 border border-accent-yellow/30 text-accent-yellow hover:bg-accent-yellow/30 px-4 gap-1 text-sm flex-shrink-0"
                >
                  Notify Me
                </Button>
              </div>
            )}

            <p className="text-xs text-white/30 mt-3">
              No spam — one email only, when the contract deploys.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
