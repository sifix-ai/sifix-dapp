"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Lock } from "lucide-react"
import { ConnectButton } from "@/components/connect-button"

interface ActionGateCardProps {
  icon: React.ElementType
  title: string
  description: string
  href: string
  isConnected: boolean
}

export function ActionGateCard({ icon: Icon, title, description, href, isConnected }: ActionGateCardProps) {
  if (!isConnected) {
    return (
      <Card className="relative overflow-hidden bg-white/[0.02] border-white/[0.06] backdrop-blur-md group opacity-60">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-white/30" />
            </div>
            <Lock className="w-3.5 h-3.5 text-white/20 ml-auto" />
          </div>
          <h4 className="text-sm font-medium text-white/40 mb-1">{title}</h4>
          <p className="text-xs text-white/25">{description}</p>
        </div>
      </Card>
    )
  }

  return (
    <Link href={href}>
      <Card className="relative overflow-hidden bg-white/[0.04] border-white/10 backdrop-blur-md hover:border-accent-blue/30 hover:bg-white/[0.06] transition-all duration-300 group cursor-pointer">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue/80 to-accent-blue flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-accent-blue transition-colors">{title}</h4>
          <p className="text-xs text-white/50">{description}</p>
        </div>
      </Card>
    </Link>
  )
}
