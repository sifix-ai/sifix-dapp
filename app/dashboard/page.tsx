"use client"

import Link from "next/link"
import { Shield, Search, Activity, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Zap, Trophy } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const stats = [
    {
      name: "Total Scans",
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      icon: Search,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      name: "Threats Detected",
      value: "89",
      change: "+3.2%",
      trend: "up",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
    {
      name: "Reports Submitted",
      value: "45",
      change: "+8.1%",
      trend: "up",
      icon: Shield,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      name: "Your Reputation",
      value: "95",
      change: "+2.4%",
      trend: "up",
      icon: TrendingUp,
      color: "text-[#4ecdc4]",
      bgColor: "bg-[#4ecdc4]/10",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "scan",
      address: "0x1234...5678",
      status: "safe",
      time: "2 minutes ago",
      risk: "Low",
    },
    {
      id: 2,
      type: "report",
      address: "0x9876...4321",
      status: "submitted",
      time: "15 minutes ago",
      risk: "High",
    },
    {
      id: 3,
      type: "scan",
      address: "0x5555...6666",
      status: "warning",
      time: "1 hour ago",
      risk: "Medium",
    },
    {
      id: 4,
      type: "scan",
      address: "0xabcd...efgh",
      status: "safe",
      time: "2 hours ago",
      risk: "Low",
    },
  ]

  const quickActions = [
    {
      name: "Scan Address",
      description: "Check wallet security",
      href: "/dashboard/search",
      icon: Search,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Report Threat",
      description: "Submit malicious address",
      href: "/dashboard/threats",
      icon: AlertTriangle,
      color: "from-red-500 to-pink-500",
    },
    {
      name: "View Threats",
      description: "Browse threat feed",
      href: "/dashboard/threats",
      icon: Activity,
      color: "from-orange-500 to-yellow-500",
    },
    {
      name: "Leaderboard",
      description: "Top security reporters",
      href: "/dashboard/leaderboard",
      icon: Trophy,
      color: "from-purple-500 to-pink-500",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Welcome back! 👋</h2>
          <p className="text-white/60">Here's what's happening with your security today.</p>
        </div>
        <Link href="/dashboard/search">
          <Button className="bg-gradient-0g text-white hover:shadow-glow-accent">
            <Zap className="w-4 h-4 mr-2" />
            Quick Scan
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="relative overflow-hidden hover:border-[#ff6b6b]/30 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-white/60 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-green-400">{stat.change}</span>
                  <span className="text-white/40">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
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
              <Card className="group hover:border-[#ff6b6b]/30 transition-all cursor-pointer h-full">
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-[#4ecdc4] transition-colors">
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
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <Link href="/dashboard/search" className="text-sm text-[#4ecdc4] hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className={`p-2 rounded-lg ${
                activity.status === "safe" ? "bg-green-500/10" :
                activity.status === "warning" ? "bg-yellow-500/10" :
                "bg-red-500/10"
              }`}>
                {activity.type === "scan" ? (
                  <Search className={`w-4 h-4 ${
                    activity.status === "safe" ? "text-green-400" :
                    activity.status === "warning" ? "text-yellow-400" :
                    "text-red-400"
                  }`} />
                ) : (
                  <Shield className="w-4 h-4 text-blue-400" />
                )}
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
      </Card>

      {/* System Status */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">System Status</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-400">All Systems Operational</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "0G Network", status: "Online", latency: "120ms" },
            { name: "AI Analysis", status: "Online", latency: "85ms" },
            { name: "0G Storage", status: "Online", latency: "200ms" },
          ].map((system) => (
            <div key={system.name} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]">
              <div>
                <p className="text-sm text-white/80">{system.name}</p>
                <p className="text-xs text-green-400">{system.status}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/60">{system.latency}</p>
                <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}