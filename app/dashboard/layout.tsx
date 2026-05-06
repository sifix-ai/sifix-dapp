"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Shield,
  Search,
  Activity,
  Trophy,
  Settings,
  Bell,
  ChevronRight,
  LogOut,
  Wallet,
  Network,
  Home,
  Menu,
  X,
  Sparkles
} from "lucide-react"
import { useAccount, useDisconnect } from "wagmi"
import { cn } from "@/lib/utils"
import { useBalance } from "@/hooks/use-balance"
import { ConnectButton } from "@/components/connect-button"
import { Card } from "@/components/ui/card"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    current: false,
  },
  {
    name: "Address Search",
    href: "/dashboard/search",
    icon: Search,
    current: false,
  },
  {
    name: "Threat Feed",
    href: "/dashboard/threats",
    icon: Activity,
    current: false,
  },
  {
    name: "Leaderboard",
    href: "/dashboard/leaderboard",
    icon: Trophy,
    current: false,
  },
]

const secondaryNavigation = [
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { formattedBalance } = useBalance()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#FF6363]/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#4ecdc4]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6363]/10 rounded-full blur-[150px]" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 99, 99, 0.5) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 99, 99, 0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />

        {/* Main content */}
        <div className="relative z-10 max-w-2xl w-full">
          {/* Logo and back button */}
          <div className="flex items-center justify-between mb-12">
            <Link href="/" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors group">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FF6363] to-[#ff4444] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">SIFIX</span>
            </div>
          </div>

          {/* Main card */}
          <div className="relative">
            {/* Glow effect behind card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#FF6363]/20 via-[#FF6363]/10 to-[#4ecdc4]/20 rounded-3xl blur-2xl" />
            
            <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border-2 border-white/[0.1] rounded-2xl p-12 shadow-2xl">
              {/* Icon with animation */}
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 bg-[#FF6363] blur-2xl opacity-50 animate-pulse" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-[#FF6363] to-[#ff4444] rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
                  <Wallet className="w-12 h-12 text-white" strokeWidth={2} />
                </div>
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 text-center tracking-tight">
                Connect Your Wallet
              </h1>
              <p className="text-lg text-white/60 mb-10 text-center max-w-md mx-auto leading-relaxed">
                Secure your crypto assets with AI-powered protection. Connect your wallet to access the SIFIX dashboard.
              </p>

              {/* Features list */}
              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.05] hover:border-[#FF6363]/30 transition-colors">
                  <div className="w-10 h-10 bg-[#FF6363]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-[#FF6363]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Real-Time Protection</h3>
                    <p className="text-sm text-white/50">AI analyzes every transaction before execution</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.05] hover:border-[#4ecdc4]/30 transition-colors">
                  <div className="w-10 h-10 bg-[#4ecdc4]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-[#4ecdc4]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Threat Detection</h3>
                    <p className="text-sm text-white/50">95%+ accuracy in identifying malicious contracts</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.05] hover:border-green-500/30 transition-colors">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Reputation System</h3>
                    <p className="text-sm text-white/50">On-chain threat intelligence and leaderboard</p>
                  </div>
                </div>
              </div>

              {/* Connect button - centered and prominent */}
              <div className="flex justify-center mb-8">
                <div className="transform hover:scale-105 transition-transform">
                  <ConnectButton />
                </div>
              </div>

              {/* Supported wallets */}
              <div className="pt-8 border-t border-white/[0.08]">
                <p className="text-xs text-white/40 text-center mb-4 uppercase tracking-wider font-semibold">Supported Wallets</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="group relative">
                    <div className="w-14 h-14 bg-white/[0.05] hover:bg-white/[0.08] rounded-xl flex items-center justify-center transition-all border border-white/[0.05] hover:border-white/[0.15]">
                      <span className="text-white/60 group-hover:text-white text-sm font-bold transition-colors">MM</span>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      MetaMask
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="w-14 h-14 bg-white/[0.05] hover:bg-white/[0.08] rounded-xl flex items-center justify-center transition-all border border-white/[0.05] hover:border-white/[0.15]">
                      <span className="text-white/60 group-hover:text-white text-sm font-bold transition-colors">CB</span>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      Coinbase
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="w-14 h-14 bg-white/[0.05] hover:bg-white/[0.08] rounded-xl flex items-center justify-center transition-all border border-white/[0.05] hover:border-white/[0.15]">
                      <span className="text-white/60 group-hover:text-white text-sm font-bold transition-colors">WC</span>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      WalletConnect
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live on 0G Newton</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>10K+ Protected Wallets</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Powered by GPT-4</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Mobile sidebar backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#101111] border-r border-white/[0.08] transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-white/[0.08]">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-0g rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-white tracking-tight">SIFIX</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-3 mb-4">
              <p className="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Main Menu
              </p>
              <div className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-gradient-0g text-white shadow-lg"
                          : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon
                        className={cn(
                          "w-5 h-5 flex-shrink-0",
                          isActive ? "text-white" : "text-white/40"
                        )}
                      />
                      <span className="flex-1">{item.name}</span>
                      {isActive && <ChevronRight className="w-4 h-4 text-white" />}
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="px-3">
              <p className="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                System
              </p>
              <div className="space-y-1">
                {secondaryNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-white/[0.08] text-white"
                          : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0 text-white/40" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-t border-white/[0.08]">
            <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg">
              <div className="w-10 h-10 bg-gradient-0g rounded-full flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{truncatedAddress}</p>
                <p className="text-xs text-[#4ecdc4] font-medium">
                  {formattedBalance || "0"} A0GI
                </p>
              </div>
              <button
                onClick={() => disconnect()}
                className="text-white/40 hover:text-white/60 transition-colors"
                title="Disconnect"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 h-16 border-b border-white/[0.08] bg-[#0a0a0f]/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-white/60 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Page title */}
            <div className="flex-1 flex items-center justify-center sm:justify-start">
              <h1 className="text-lg font-semibold text-white">
                {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
              </h1>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Network indicator */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                <Network className="w-3 h-3 text-green-500" />
                <span className="text-xs font-medium text-green-400">0G Newton</span>
              </div>

              {/* Notifications */}
              <button className="relative text-white/60 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-[#ff6b6b] rounded-full border-2 border-[#0a0a0f]" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}