"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Ghost, TrendingDown, Receipt } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamic import to avoid SSR hydration issues
const WorldMap = dynamic(
  () => import("@/components/ui/world-map").then((mod) => ({ default: mod.WorldMap })),
  { ssr: false }
)

export function ProblemSection() {
  const threats = [
    {
      icon: Receipt,
      title: "Malicious Contracts",
      description: "Hidden code that drains your wallet after approval",
    },
    {
      icon: Ghost,
      title: "Phishing Attacks",
      description: "Fake websites that look like legitimate dApps",
    },
    {
      icon: TrendingDown,
      title: "Rug Pulls",
      description: "Developers abandon projects after raising funds",
    },
    {
      icon: AlertTriangle,
      title: "Approval Scams",
      description: "Unlimited spending permissions you didn't notice",
    },
  ]

  // Threat connections showing global attack patterns
  const threatConnections = [
    {
      start: { lat: 37.7749, lng: -122.4194, label: "SF" },
      end: { lat: 40.7128, lng: -74.0060, label: "NYC" },
    },
    {
      start: { lat: 51.5074, lng: -0.1278, label: "London" },
      end: { lat: 39.9042, lng: 116.4074, label: "Beijing" },
    },
    {
      start: { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
      end: { lat: 1.3521, lng: 103.8198, label: "Singapore" },
    },
    {
      start: { lat: -23.5505, lng: -46.6333, label: "São Paulo" },
      end: { lat: 51.5074, lng: -0.1278, label: "London" },
    },
    {
      start: { lat: 19.0760, lng: 72.8777, label: "Mumbai" },
      end: { lat: -1.2921, lng: 36.8219, label: "Nairobi" },
    },
  ]

  return (
    <section className="py-32 relative bg-canvas overflow-hidden">
      {/* World Map Background */}
      <div className="absolute inset-0">
        <WorldMap
          dots={threatConnections}
          lineColor="#ef4444"
          showLabels={false}
          animationDuration={3}
          loop={true}
        />
      </div>

      {/* Dark overlay to make content readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/90 via-canvas/70 to-canvas/90 pointer-events-none" />

      {/* Atmospheric glow - red accent - subtle */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[1000px] h-[1000px] bg-accent-red-glow rounded-full blur-3xl opacity-15" />
      </div>

      <div className="px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/15 rounded-full mb-8 backdrop-blur-md">
              <AlertTriangle className="w-4 h-4 text-accent-red" />
              <span className="text-xs font-medium text-white tracking-wide">THE PROBLEM</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[64px] leading-[1.1] tracking-tight text-ink mb-6 font-normal">
              Web3 is a <span className="text-accent-red">global minefield</span>
            </h2>
            <p className="text-lg text-body mb-8 leading-relaxed max-w-3xl mx-auto">
              Every day, hackers steal millions through sophisticated attacks targeting users worldwide. Even experienced crypto users fall victim to these evolving threats.
            </p>
          </motion.div>

          {/* Threat Cards - Feature Card Style */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {threats.map((threat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-white/[0.04] border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300"
              >
                <threat.icon className="w-6 h-6 text-accent-red mb-6" strokeWidth={1.5} />
                <h3 className="text-base font-medium text-ink mb-2">{threat.title}</h3>
                <p className="text-sm text-charcoal leading-relaxed">{threat.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Reality Check - Code Window Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative bg-white/[0.04] border border-white/10 rounded-2xl p-8 backdrop-blur-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-accent-red" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-charcoal uppercase tracking-wider mb-2">Reality Check</div>
                <p className="text-2xl font-medium text-ink mb-1">
                  Over $2 Billion Stolen in 2024
                </p>
                <p className="text-sm text-charcoal">
                  That's how much was stolen from Web3 users through these attacks
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
