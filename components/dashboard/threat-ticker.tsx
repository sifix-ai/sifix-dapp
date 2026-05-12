"use client"

import { useEffect, useRef, useState } from "react"
import { Shield, AlertTriangle, Skull, ArrowRight } from "lucide-react"
import Link from "next/link"

interface ThreatItem {
  id: string
  address: string
  riskLevel: string
  threatType?: string
  createdAt?: string
}

const riskIcon = (level: string) => {
  switch (level?.toUpperCase()) {
    case "CRITICAL": return <Skull className="w-3.5 h-3.5 text-red-400" />
    case "HIGH": return <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
    default: return <Shield className="w-3.5 h-3.5 text-amber-400" />
  }
}

const riskBg = (level: string) => {
  switch (level?.toUpperCase()) {
    case "CRITICAL": return "border-red-500/30 bg-red-500/5"
    case "HIGH": return "border-orange-500/30 bg-orange-500/5"
    default: return "border-amber-500/30 bg-amber-500/5"
  }
}

export function ThreatTicker({ threats }: { threats: ThreatItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!scrollRef.current || paused || threats.length === 0) return
    const el = scrollRef.current
    let frame: number
    let pos = 0
    const speed = 0.5

    const step = () => {
      pos += speed
      if (pos >= el.scrollWidth / 2) pos = 0
      el.scrollLeft = pos
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [threats, paused])

  if (!threats || threats.length === 0) return null

  const items = [...threats, ...threats] // duplicate for seamless loop

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">Live Threats</span>
        </div>
        <div
          ref={scrollRef}
          className="flex-1 overflow-hidden flex gap-2"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {items.map((t, i) => (
            <Link
              key={`${t.id}-${i}`}
              href={`/dashboard/checker?q=${t.address}`}
              className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono text-white/60 hover:text-white transition-colors ${riskBg(t.riskLevel)}`}
            >
              {riskIcon(t.riskLevel)}
              <span>{t.address?.slice(0, 6)}...{t.address?.slice(-4)}</span>
              <span className="text-white/30">{t.riskLevel?.toUpperCase()}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
