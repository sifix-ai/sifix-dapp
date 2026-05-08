"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Shield, Search, Activity, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Zap, Trophy, Puzzle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const [statsData, setStatsData] = useState<any>(null)
  const [threats, setThreats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, threatsRes] = await Promise.all([
        fetch('/api/v1/stats').catch(() => null),
        fetch('/api/v1/threats?limit=5').catch(() => null),
      ])

      if (statsRes?.ok) {
        const statsJson = await statsRes.json()
        if (statsJson.success) setStatsData(statsJson.data)
      }
      if (threatsRes?.ok) {
        const threatsJson = await threatsRes.json()
        if (threatsJson.success) setThreats(threatsJson.data?.reports || threatsJson.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      name: "Total Scans",
      value: statsData?.totalScans?.toLocaleString() ?? "100K+",
      icon: Search,
      gradient: "from-accent-blue to-accent-blue",
    },
    {
      name: "Threats Detected",
      value: statsData?.criticalThreats?.toLocaleString() ?? "5K+",
      icon: AlertTriangle,
      gradient: "from-accent-blue to-accent-blue",
    },
    {
      name: "Reports Submitted",
      value: statsData?.totalReports?.toLocaleString() ?? "500+",
      icon: Shield,
      gradient: "from-accent-blue to-accent-blue",
    },
    {
      name: "Accuracy Rate",
      value: "99.9%",
      icon: TrendingUp,
      gradient: "from-accent-blue to-accent-blue",
    },
  ]

  const recentActivity = threats.slice(0, 5).map((t: any, i: number) => ({
    id: t.id || i,
    type: "report" as const,
    address: t.targetAddress ? `${t.targetAddress.slice(0, 6)}...${t.targetAddress.slice(-4)}` : "Unknown",
    status: t.riskLevel === "critical" ? "danger" : t.riskLevel === "high" ? "warning" : "safe",
    time: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "Recently",
    risk: t.riskLevel ? t.riskLevel.charAt(0).toUpperCase() + t.riskLevel.slice(1) : "Low",
  }))

  const quickActions = [
    {
      name: "Scan Address",
      description: "Check wallet security",
      href: "/dashboard/search",
      icon: Search,
      color: "from-accent-blue to-accent-blue",
    },
    {
      name: "Report Threat",
      description: "Submit malicious address",
      href: "/dashboard/threats",
      icon: AlertTriangle,
      color: "from-accent-blue to-accent-blue",
    },
    {
      name: "View Threats",
      description: "Browse threat feed",
      href: "/dashboard/threats",
      icon: Activity,
      color: "from-accent-blue to-accent-blue",
    },
    {
      name: "Leaderboard",
      description: "Top security reporters",
      href: "/dashboard/leaderboard",
      icon: Trophy,
      color: "from-accent-blue to-accent-blue",
    },
    {
      name: "Extension Setup",
      description: "Connect browser extension",
      href: "/dashboard/extension",
      icon: Puzzle,
      color: "from-accent-blue to-accent-blue",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Welcome back! 👋</h2>
          <p className="text-white/60">Here&apos;s what&apos;s happening with your security today.</p>
        </div>
        <Link href="/dashboard/search">
          <Button className="h-10 rounded-xl border border-white/15 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-pink text-white hover:shadow-lg hover:shadow-accent-blue/20 backdrop-blur-md">
            <Zap className="w-4 h-4 mr-2" />
            Quick Scan
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="relative overflow-hidden bg-white/[0.04] backdrop-blur-md border-white/15 hover:bg-white/[0.06] hover:border-white/20 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-white/60 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-white mb-2">
                  {loading ? (
                    <span className="inline-block w-16 h-8 bg-white/5 animate-pulse rounded" />
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.name} href={action.href}>
              <Card className="group bg-white/[0.04] backdrop-blur-md border-white/15 hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer h-full">
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-accent-blue transition-colors">
                  {action.name}
                </h4>
                <p className="text-sm text-white/60">{action.description}</p>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all mt-2" />
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <Link href="/dashboard/threats" className="text-sm text-accent-blue hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Activity className="w-5 h-5 text-white/40 animate-spin" />
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No activity yet</p>
            <Link href="/dashboard/search">
              <Button variant="ghost" className="mt-3 text-accent-blue hover:text-accent-blue">
                Start scanning
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className={`p-2 rounded-lg ${
                  activity.status === "safe" ? "bg-accent-blue/10" :
                  activity.status === "warning" ? "bg-accent-purple/10" :
                  "bg-accent-pink/10"
                }`}>
                  <Shield className={`w-4 h-4 ${
                    activity.status === "safe" ? "text-accent-blue" :
                    activity.status === "warning" ? "text-accent-purple" :
                    "text-accent-pink"
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 truncate">{activity.address}</p>
                  <p className="text-xs text-white/40">{activity.time}</p>
                </div>
                <Badge variant={activity.risk === "Low" ? "safe" : activity.risk === "Medium" ? "warning" : "danger"}>
                  {activity.risk}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* System Status */}
      <Card className="bg-white/[0.04] backdrop-blur-md border-white/15">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">System Status</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" />
            <span className="text-sm text-accent-blue">All Systems Operational</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "0G Network", status: "Online", latency: "120ms" },
            { name: "AI Analysis", status: "Online", latency: "85ms" },
            { name: "0G Storage", status: "Online", latency: "200ms" },
          ].map((system) => (
            <div key={system.name} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/10">
              <div>
                <p className="text-sm text-white/80">{system.name}</p>
                <p className="text-xs text-accent-blue">{system.status}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/60">{system.latency}</p>
                <CheckCircle className="w-4 h-4 text-accent-blue mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
