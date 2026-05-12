"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle, Cpu, Database, Globe } from "lucide-react"

const systems = [
  { name: "0G Network", latency: "120ms", icon: Globe },
  { name: "AI Analysis", latency: "85ms", icon: Cpu },
  { name: "0G Storage", latency: "200ms", icon: Database },
]

export function GuardStatusCard() {
  return (
    <Card className="bg-white/[0.03] border-white/10 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Wallet Guard Status</h3>
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
          <CheckCircle className="w-3.5 h-3.5" />
          Operational
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {systems.map((s) => (
          <div key={s.name} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
            <div className="flex items-center justify-between mb-1.5">
              <s.icon className="w-3.5 h-3.5 text-accent-blue" />
              <span className="text-[10px] text-emerald-400">Online</span>
            </div>
            <p className="text-xs text-white/70">{s.name}</p>
            <p className="text-[11px] text-white/40">{s.latency}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
