"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle, Cpu, Database, Globe, XCircle } from "lucide-react"
import { useSystemStatus } from "@/hooks/use-system-status"

const iconMap: Record<string, any> = {
  "0G Network": Globe,
  "AI Analysis": Cpu,
  "0G Storage": Database,
}

export function GuardStatusCard() {
  const { data, isLoading } = useSystemStatus()
  const systems = data?.systems ?? []
  const operational = !!data?.operational

  return (
    <Card className="bg-white/[0.03] border-white/10 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Wallet Guard Status</h3>
        <div className={`flex items-center gap-2 text-xs font-medium ${operational ? 'text-emerald-400' : 'text-red-400'}`}>
          {operational ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
          {isLoading ? 'Checking...' : operational ? 'Operational' : 'Degraded'}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {systems.map((s: any) => {
          const Icon = iconMap[s.name] || Globe
          return (
            <div key={s.name} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <div className="flex items-center justify-between mb-1.5">
                <Icon className="w-3.5 h-3.5 text-accent-blue" />
                <span className={`text-[10px] ${s.status === 'online' ? 'text-emerald-400' : s.status === 'degraded' ? 'text-amber-400' : 'text-red-400'}`}>
                  {s.status === 'online' ? 'Online' : s.status === 'degraded' ? 'Degraded' : 'Offline'}
                </span>
              </div>
              <p className="text-xs text-white/70">{s.name}</p>
              <p className="text-[11px] text-white/40">{s.latencyMs}ms</p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
