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
