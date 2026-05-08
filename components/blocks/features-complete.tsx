"use client"

import { motion } from "framer-motion"
import {
  Zap,
  MessageSquare,
  DollarSign,
  AlertTriangle,
  Star,
  Database,
} from "lucide-react"

export function FeaturesComplete() {
  const features = [
    {
      icon: Zap,
      title: "Real-Time Analysis",
      description: "Every transaction analyzed in milliseconds by AI",
    },
    {
      icon: MessageSquare,
      title: "AI Explanations",
      description: "Get clear, natural language explanations of what each transaction does",
    },
    {
      icon: DollarSign,
      title: "Gas Preview",
      description: "See exact gas costs before confirming any transaction",
    },
    {
      icon: AlertTriangle,
      title: "Threat Alerts",
      description: "Instant warnings for malicious contracts, phishing, and suspicious patterns",
    },
    {
      icon: Star,
      title: "On-Chain Reputation",
      description: "Community-driven security scores for contracts and addresses",
    },
    {
      icon: Database,
      title: "Decentralized Storage",
      description: "All threat evidence permanently stored on 0G Chain",
    },
  ]

  return (
    <section id="features" className="py-32 relative bg-canvas">
      {/* Atmospheric glow - orange accent - subtle */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[1000px] h-[1000px] bg-accent-orange-glow rounded-full blur-3xl opacity-15" />
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
              <span className="text-xs font-medium text-body tracking-wide">FEATURES</span>
            </div>
            <h2 className="font-display text-[76.8px] leading-[1.0] tracking-[-0.768px] text-ink mb-6 font-normal">
              Complete protection
            </h2>
            <p className="text-lg text-body max-w-2xl">
              Powerful features for everyday users and Web3 natives
            </p>
          </motion.div>

          {/* Features Grid - Feature Card Style */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="feature-card"
              >
                <feature.icon className="w-6 h-6 text-ink mb-6" strokeWidth={1.5} />
                
                <h3 className="text-xl font-medium text-ink mb-3 leading-tight">{feature.title}</h3>
                <p className="text-sm text-charcoal leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Bottom badges - Resend pill style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12 flex flex-wrap gap-3"
          >
            <div className="px-4 py-2 bg-surface-elevated border border-hairline-strong rounded-full text-xs text-body">
              Free to use
            </div>
            <div className="px-4 py-2 bg-surface-elevated border border-hairline-strong rounded-full text-xs text-body">
              Open source
            </div>
            <div className="px-4 py-2 bg-surface-elevated border border-hairline-strong rounded-full text-xs text-body">
              Privacy-first
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
