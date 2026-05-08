"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Brain, CheckCircle } from "lucide-react"

export function SolutionSection() {
  const steps = [
    {
      step: "01",
      icon: Shield,
      title: "Intercept",
      description: "Browser extension catches every transaction before signing",
    },
    {
      step: "02",
      icon: Zap,
      title: "Simulate",
      description: "Run transaction in sandbox environment to predict outcome",
    },
    {
      step: "03",
      icon: Brain,
      title: "Analyze",
      description: "GPT-4 AI agent examines contract code, patterns, and risks",
    },
    {
      step: "04",
      icon: CheckCircle,
      title: "Protect",
      description: "Get clear risk assessment and block threats before execution",
    },
  ]

  return (
    <section id="how-it-works" className="py-32 relative bg-canvas">
      {/* Atmospheric glow - blue accent - subtle */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[1000px] h-[1000px] bg-accent-blue-glow rounded-full blur-3xl opacity-12" />
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
              <Shield className="w-4 h-4 text-accent-blue" />
              <span className="text-xs font-medium text-body tracking-wide">THE SOLUTION</span>
            </div>
            <h2 className="font-display text-[76.8px] leading-[1.0] tracking-[-0.768px] text-ink mb-6 font-normal">
              How SIFIX protects you
            </h2>
            <p className="text-lg text-body max-w-2xl">
              Four-layer defense system powered by AI and decentralized infrastructure
            </p>
          </motion.div>

          {/* Steps Grid - Feature Card Style with Step Numbers */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                {/* Step number badge */}
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-on rounded-lg flex items-center justify-center text-xs font-medium shadow-lg z-10">
                  {step.step}
                </div>

                <div className="feature-card pt-8">
                  <step.icon className="w-6 h-6 text-ink mb-6" strokeWidth={1.5} />
                  <h3 className="text-base font-medium text-ink mb-2">{step.title}</h3>
                  <p className="text-sm text-charcoal leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
