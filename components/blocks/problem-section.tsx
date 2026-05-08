"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Ghost, TrendingDown, Receipt } from "lucide-react"

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

  return (
    <section className="py-32 relative bg-canvas">
      {/* Atmospheric glow - red accent - subtle */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[1000px] h-[1000px] bg-accent-red-glow rounded-full blur-3xl opacity-15" />
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header - Resend Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-hairline-strong rounded-full mb-8">
              <AlertTriangle className="w-4 h-4 text-accent-red" />
              <span className="text-xs font-medium text-body tracking-wide">THE PROBLEM</span>
            </div>
            <h2 className="font-display text-[76.8px] leading-[1.0] tracking-[-0.768px] text-ink mb-6 font-normal">
              Web3 is a minefield
            </h2>
            <p className="text-lg text-body max-w-2xl">
              Every day, hackers steal millions through sophisticated attacks. Even experienced users fall victim.
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
                className="feature-card"
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
            className="code-window"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-accent-red" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-ash uppercase tracking-wider mb-2">Reality Check</div>
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
