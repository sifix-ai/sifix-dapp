"use client"

import { useAccount } from "wagmi"
import Link from "next/link"
import {
  Shield, Search, AlertTriangle, TrendingUp, Activity,
  Eye, Tag, Trophy, Zap, ArrowRight, Wallet, Lock, Loader2,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ConnectButton } from "@/components/connect-button"
import { useDashboardStats, useRecentThreats } from "@/hooks/use-dashboard"
import { useLeaderboard } from "@/hooks/use-analytics"
import { ThreatTicker } from "@/components/dashboard/threat-ticker"
import { GuardStatusCard } from "@/components/dashboard/guard-status-card"
import { ActionGateCard } from "@/components/dashboard/action-gate-card"
import { useAppStore } from "@/store/app-store"

// ─── Stagger animation helper ────────────────────────────
const stagger = (i: number) => ({ animationDelay: `${i * 80}ms` })

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const { extensionInstalled, extensionConnected, extensionSetupStep } = useAppStore()
  const { data: statsData, isLoading: statsLoading } = useDashboardStats()
  const { data: threats, isLoading: threatsLoading } = useRecentThreats(10)
  const { data: leaderboard } = useLeaderboard(5)
  const loading = statsLoading || threatsLoading

  // ─── Real stats from API ────────────────────────────────
  const stats = [
    { name: "Total Scans", value: statsData?.totalScans?.toLocaleString() ?? "—", icon: Search, color: "from-accent-blue to-blue-600" },
    { name: "Threats Detected", value: statsData?.criticalThreats?.toLocaleString() ?? "—", icon: AlertTriangle, color: "from-red-500 to-red-600" },
    { name: "Reports Submitted", value: statsData?.totalReports?.toLocaleString() ?? "—", icon: Shield, color: "from-amber-500 to-amber-600" },
    { name: "Addresses Tracked", value: statsData?.totalAddresses?.toLocaleString() ?? "—", icon: Eye, color: "from-emerald-500 to-emerald-600" },
  ]

  // ─── Real threats ───────────────────────────────────────
  const recentThreats = (threats || []).slice(0, 5).map((t: any, i: number) => ({
    id: t.id || i,
    address: t.targetAddress || t.address || "Unknown",
    riskLevel: t.riskLevel || "LOW",
    threatType: t.threatType || "Unknown",
    createdAt: t.createdAt,
  }))

  // ─── Quick actions (gated) ──────────────────────────────
  const actions = [
    { icon: Search, title: "Scan Address", description: "Check any wallet or contract", href: "/dashboard/checker" },
    { icon: AlertTriangle, title: "Report Threat", description: "Submit malicious address", href: "/dashboard/threats" },
    { icon: Eye, title: "Watchlist", description: "Monitor risky addresses", href: "/dashboard/watchlist" },
    { icon: Tag, title: "Community Tags", description: "Label wallets & contracts", href: "/dashboard/tags" },
    { icon: Trophy, title: "Leaderboard", description: "Top security reporters", href: "/dashboard/leaderboard" },
    { icon: Activity, title: "Threat Feed", description: "Live threat intelligence", href: "/dashboard/threats" },
  ]

  // ─── Risk badge helper ──────────────────────────────────
  const riskBadge = (level: string) => {
    const l = level?.toUpperCase()
    if (l === "CRITICAL") return <Badge variant="danger"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />{l}</span></Badge>
    if (l === "HIGH") return <Badge variant="danger">{l}</Badge>
    if (l === "MEDIUM") return <Badge variant="warning">{l}</Badge>
    return <Badge variant="safe">{l}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* ─── Live Threat Ticker ───────────────────────────── */}
      <div className="animate-fade-in" style={stagger(0)}>
        <ThreatTicker threats={recentThreats} />
      </div>

      {/* ─── Hero Section (dual mode) ─────────────────────── */}
      <div className="animate-fade-in" style={stagger(1)}>
        {isConnected ? (
          /* ── AUTH: Wallet Guard Active ── */
          <Card className="relative overflow-hidden bg-gradient-to-r from-accent-blue/10 via-transparent to-emerald-500/5 border-accent-blue/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.08),transparent_60%)]" />
            <div className="relative p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-blue to-blue-600 flex items-center justify-center shadow-lg shadow-accent-blue/20">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-canvas" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Wallet Guard Active</h2>
                  <p className="text-sm text-white/50 font-mono">
                    {address?.slice(0, 6)}...{address?.slice(-4)} is protected
                  </p>
                </div>
              </div>
              <Link href="/dashboard/checker">
                <Button className="h-10 rounded-xl bg-gradient-to-r from-accent-blue to-blue-600 text-white hover:shadow-lg hover:shadow-accent-blue/20 transition-all">
                  <Zap className="w-4 h-4 mr-2" />
                  Quick Scan
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          /* ── UNAUTH: Connect CTA ── */
          <Card className="relative overflow-hidden bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-white/[0.04] border-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.04),transparent_60%)]" />
            <div className="relative p-8 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-blue/10 border border-accent-blue/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-accent-blue" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">SIFIX Wallet Guard</h2>
                <p className="text-sm text-white/50 max-w-md">
                  Real-time threat intelligence for the 0G ecosystem. Connect your wallet to activate full protection.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ConnectButton />
                <span className="text-xs text-white/30">Read-only mode active</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* ─── Stats Grid (visible to all) ──────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in" style={stagger(2)}>
        {stats.map((stat) => (
          <Card key={stat.name} className="bg-white/[0.03] border-white/10 backdrop-blur-md hover:border-white/20 transition-all duration-300">
            <div className="p-4 flex items-start justify-between">
              <div>
                <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-white">
                  {loading ? (
                    <span className="inline-block w-12 h-7 bg-white/5 animate-pulse rounded" />
                  ) : stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ─── Quick Actions (gated) ────────────────────────── */}
      <div className="animate-fade-in" style={stagger(3)}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Quick Actions</h3>
          {!isConnected && (
            <span className="text-[10px] text-white/25 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Connect to unlock
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {actions.map((action) => (
            <ActionGateCard
              key={action.title}
              icon={action.icon}
              title={action.title}
              description={action.description}
              href={action.href}
              isConnected={isConnected}
            />
          ))}
        </div>
      </div>

      {/* ─── Recent Threats + Leaderboard ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in" style={stagger(4)}>
        {/* Recent Threats */}
        <Card className="lg:col-span-2 bg-white/[0.03] border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4 p-4 pb-0">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Recent Threats</h3>
            <Link href="/dashboard/threats" className="text-xs text-accent-blue hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-4 pt-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 text-white/20 animate-spin" />
              </div>
            ) : recentThreats.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="w-8 h-8 text-white/10 mx-auto mb-2" />
                <p className="text-xs text-white/25">No threats detected yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentThreats.map((t) => (
                  <Link
                    key={t.id}
                    href={`/dashboard/checker?q=${t.address}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-all"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      t.riskLevel?.toUpperCase() === "CRITICAL" ? "bg-red-500/10" :
                      t.riskLevel?.toUpperCase() === "HIGH" ? "bg-orange-500/10" : "bg-amber-500/10"
                    }`}>
                      <AlertTriangle className={`w-4 h-4 ${
                        t.riskLevel?.toUpperCase() === "CRITICAL" ? "text-red-400" :
                        t.riskLevel?.toUpperCase() === "HIGH" ? "text-orange-400" : "text-amber-400"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-white/60 truncate">{t.address}</p>
                      <p className="text-[10px] text-white/30">{t.threatType}</p>
                    </div>
                    {riskBadge(t.riskLevel)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Top Reporters */}
        <Card className="bg-white/[0.03] border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4 p-4 pb-0">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Top Reporters</h3>
            <Link href="/dashboard/leaderboard" className="text-xs text-accent-blue hover:underline">View all</Link>
          </div>
          <div className="p-4 pt-2">
            {(leaderboard || []).length === 0 ? (
              <div className="text-center py-6">
                <Trophy className="w-6 h-6 text-white/10 mx-auto mb-2" />
                <p className="text-xs text-white/25">No reporters yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {(leaderboard || []).slice(0, 5).map((r: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      i === 0 ? "bg-yellow-500/20 text-yellow-400" :
                      i === 1 ? "bg-gray-400/20 text-gray-300" :
                      i === 2 ? "bg-amber-600/20 text-amber-500" : "bg-white/5 text-white/30"
                    }`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-white/60 truncate">
                        {r.address?.slice(0, 6)}...{r.address?.slice(-4)}
                      </p>
                    </div>
                    <span className="text-[10px] text-white/30">{r.reportsSubmitted ?? 0} reports</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ─── Extension Status (visible to all) ────────────── */}
      <div className="animate-fade-in" style={stagger(5)}>
        <Card className="bg-white/[0.03] border-white/10 backdrop-blur-md p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wider">Extension Status</p>
              <p className="text-sm text-white mt-1">
                {!extensionInstalled ? "Not Installed" : !extensionConnected ? "Installed, not verified" : "Connected & Verified"}
              </p>
              <p className="text-[11px] text-white/35 mt-1">Step: {extensionSetupStep}</p>
            </div>
            <Link href="/dashboard/extension">
              <Button size="sm" className="bg-accent-blue text-white">
                {!extensionInstalled || !extensionConnected ? "Complete Setup" : "Manage"}
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* ─── Wallet Guard Status (visible to all) ─────────── */}
      <div className="animate-fade-in" style={stagger(6)}>
        <GuardStatusCard />
      </div>
    </div>
  )
}
