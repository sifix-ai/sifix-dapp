"use client"

import { motion } from "framer-motion"
import { X, Check, Shield } from "lucide-react"

export function WhySifixSection() {
  const comparisons = [
    {
      without: "Sign transactions blindly",
      with: "AI analyzes every transaction first",
    },
    {
      without: "Hope contracts are safe",
      with: "Get detailed security reports",
    },
    {
      without: "Notice attacks after losing funds",
      with: "Block threats before they execute",
    },
    {
      without: "Trust individual dApp reviews",
      with: "Community-powered reputation system",
    },
  ]

  return (
    <section className="py-32 relative bg-canvas">
      {/* Atmospheric glow - blue accent - very subtle */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-accent-blue-glow rounded-full blur-3xl opacity-10" />
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
              <Shield className="w-4 h-4 text-body" />
              <span className="text-xs font-medium text-body tracking-wide">WHY CHOOSE SIFIX</span>
            </div>
            <h2 className="font-display text-[76.8px] leading-[1.0] tracking-[-0.768px] text-ink mb-6 font-normal max-w-4xl">
              The difference
            </h2>
            <p className="text-lg text-body max-w-2xl">
              Between losing everything and staying safe
            </p>
          </motion.div>

          {/* Comparison Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Without SIFIX */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="feature-card"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-hairline">
                <div className="w-8 h-8 bg-surface-deep rounded-lg flex items-center justify-center">
                  <X className="w-4 h-4 text-accent-red" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-base font-medium text-ink">Without SIFIX</h3>
                  <p className="text-xs text-ash">Vulnerable</p>
                </div>
              </div>

              {/* List */}
              <div className="space-y-3">
                {comparisons.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-4 h-4 rounded-full border border-hairline-strong flex items-center justify-center mt-0.5">
                      <X className="w-2.5 h-2.5 text-accent-red" strokeWidth={2} />
                    </div>
                    <p className="text-sm text-charcoal">{item.without}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* With SIFIX */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="feature-card"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-hairline">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-on" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-base font-medium text-ink">With SIFIX</h3>
                  <p className="text-xs text-accent-green">Fully protected</p>
                </div>
              </div>

              {/* List */}
              <div className="space-y-3">
                {comparisons.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 + 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-accent-green flex items-center justify-center mt-0.5">
                      <Check className="w-2.5 h-2.5 text-primary-on" strokeWidth={2} />
                    </div>
                    <p className="text-sm text-body">{item.with}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
