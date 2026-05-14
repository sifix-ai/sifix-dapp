"use client"

import { motion } from "framer-motion"
import { Download, Shield, Zap, Eye, BrainCircuit, CheckCircle2 } from "lucide-react"

const features = [
  {
    icon: Eye,
    title: "Real-time Transaction Scanning",
    description: "Every transaction is scanned by our AI agent before you sign — no manual lookup needed.",
  },
  {
    icon: BrainCircuit,
    title: "Agentic AI Analysis",
    description: "Powered by Agentic ID on 0G Compute, the agent reasons about threats with on-chain context.",
  },
  {
    icon: Zap,
    title: "Instant Threat Alerts",
    description: "Get actionable warnings directly in your browser the moment a risk is detected.",
  },
  {
    icon: Shield,
    title: "Community Threat Intel",
    description: "Backed by crowd-sourced threat reports stored on 0G Storage — always up to date.",
  },
]

const steps = [
  "Install the SIFIX extension from Chrome Web Store",
  "Connect your wallet — one click, no setup",
  "Browse and transact normally",
  "AI agent watches every interaction in real time",
]

export function ExtensionSection() {
  return (
    <section className="py-32 relative bg-canvas overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-200 h-200 bg-accent-blue/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-150 h-150 bg-accent-green/5 rounded-full blur-3xl" />
      </div>

      <div className="px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left — Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/4 border border-white/15 rounded-full mb-8 backdrop-blur-md">
                  <Download className="w-4 h-4 text-accent-blue" />
                  <span className="text-xs font-medium text-white tracking-wide">BROWSER EXTENSION</span>
                </div>

                <h2 className="font-display text-4xl md:text-5xl leading-[1.1] tracking-tight text-ink mb-6 font-normal">
                  AI Agent Protection,{" "}
                  <span className="text-accent-blue">Right in Your Browser</span>
                </h2>

                <p className="text-lg text-body mb-10 max-w-lg">
                  The SIFIX extension puts a real-time AI security agent in your browser. It silently monitors every
                  Web3 interaction and alerts you before a malicious transaction can cost you.
                </p>

                {/* Steps */}
                <ul className="space-y-4 mb-10">
                  {steps.map((step, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-accent-green mt-0.5 shrink-0" strokeWidth={1.5} />
                      <span className="text-body text-sm">{step}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex flex-wrap gap-4"
                >
                  <a
                    href="/dashboard/extension"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent-blue text-black font-semibold rounded-xl hover:bg-accent-blue/90 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Get the Extension
                  </a>
                  <a
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/6 border border-white/15 text-ink rounded-xl hover:bg-white/10 transition-colors text-sm backdrop-blur-md"
                  >
                    Open Dashboard
                  </a>
                </motion.div>
              </motion.div>
            </div>

            {/* Right — Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-linear-to-b from-accent-blue/5 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative bg-white/4 border border-white/10 rounded-2xl p-5 backdrop-blur-md hover:bg-white/6 hover:border-white/20 transition-all duration-300 h-full">
                    <div className="w-10 h-10 bg-accent-blue/10 rounded-xl flex items-center justify-center mb-4">
                      <feature.icon className="w-5 h-5 text-accent-blue" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-sm font-semibold text-ink mb-2">{feature.title}</h3>
                    <p className="text-xs text-charcoal leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}

              {/* Live badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="sm:col-span-2"
              >
                <div className="bg-accent-green/5 border border-accent-green/20 rounded-2xl p-5 flex items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="w-3 h-3 bg-accent-green rounded-full" />
                    <div className="absolute inset-0 w-3 h-3 bg-accent-green rounded-full animate-ping opacity-60" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-accent-green">Agent Active</p>
                    <p className="text-xs text-charcoal">
                      SIFIX AI agent is scanning in real time — 0 threats missed since launch
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
