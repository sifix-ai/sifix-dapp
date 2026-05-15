"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
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
  Sparkles,
  History,
  ExternalLink,
  Eye,
  Tag,
  Store,
  Coins,
  Puzzle,
} from "lucide-react"
import { useAccount, useDisconnect } from "wagmi"
import { cn } from "@/lib/utils"
import { useBalance } from "@/hooks/use-balance"
import { ConnectButton } from "@/components/connect-button"
import { WalletGuard } from "@/components/dashboard/wallet-guard"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ToastContainer } from "@/components/ui/toast"


const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    current: false,
  },
  {
    name: "Checker",
    href: "/dashboard/checker",
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
    name: "Watchlist",
    href: "/dashboard/watchlist",
    icon: Eye,
    current: false,
  },
  {
    name: "Tags",
    href: "/dashboard/tags",
    icon: Tag,
    current: false,
  },
  {
    name: "Scan History",
    href: "/dashboard/history",
    icon: History,
    current: false,
  },
  {
    name: "Leaderboard",
    href: "/dashboard/leaderboard",
    icon: Trophy,
    current: false,
  },
  {
    name: "Agent ID",
    href: "/dashboard/agent",
    icon: Sparkles,
    current: false,
  },
  {
    name: "Marketplace",
    href: "/dashboard/marketplace",
    icon: Store,
    current: false,
  },
  {
    name: "Staking",
    href: "/dashboard/staking",
    icon: Coins,
    current: false,
  },
]

const secondaryNavigation = [
  {
    name: "Extension Setup",
    href: "/dashboard/extension",
    icon: Puzzle,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

const allNavigation = [...navigation, ...secondaryNavigation]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { formattedBalance } = useBalance()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const faucetUrl = address ? `https://faucet.0g.ai/?address=${address}` : 'https://faucet.0g.ai'

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null

  return (
    <WalletGuard>
    <div className="min-h-screen bg-canvas">
      <ToastContainer />
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
          "fixed inset-y-0 left-0 z-50 w-64 bg-canvas/95 backdrop-blur-xl border-r border-white/15 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-white/15">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-blue rounded-lg flex items-center justify-center">
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
                          ? "bg-gradient-to-r from-accent-blue to-accent-blue text-white shadow-lg shadow-accent-blue/20"
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
          {/* Faucet Button */}
          {isConnected && (
            <div className="px-4 pb-4">
              <a 
                href={faucetUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue/80 to-accent-blue text-white text-sm font-medium hover:shadow-lg hover:shadow-accent-blue/20 transition-all duration-200 group"
              >
                <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Claim Faucet</span>
              </a>
            </div>
          )}

          {/* Wallet Connection */}
          <div className="p-4 border-t border-white/15">
            {isConnected && address ? (
              <div className="flex items-center gap-3 p-3 bg-white/[0.04] backdrop-blur-md rounded-lg border border-white/15">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-blue to-accent-blue rounded-full flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{truncatedAddress}</p>
                  <p className="text-xs text-accent-blue font-medium">
                    {formattedBalance || "0"} A0GI
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('sifix_api_token')
                      localStorage.removeItem('sifix_api_token_expires')
                    }
                    disconnect()
                  }}
                  className="text-white/40 hover:text-white/60 transition-colors"
                  title="Disconnect"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <ConnectButton />
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 h-16 border-b border-white/15 bg-canvas/70 backdrop-blur-xl">
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
                {allNavigation.find((item) => item.href === pathname)?.name || "Dashboard"}
              </h1>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Network indicator */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-accent-blue/10 border border-accent-blue/20 rounded-lg backdrop-blur-md">
                <Network className="w-3 h-3 text-accent-blue" />
                <span className="text-xs font-medium text-accent-blue">0G Galileo</span>
              </div>

              {/* Notifications */}
              <button className="relative text-white/60 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-accent-blue rounded-full border-2 border-canvas" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
    </WalletGuard>
  )
}
