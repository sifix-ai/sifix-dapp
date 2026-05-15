"use client"

import { motion } from "framer-motion"
import { Coins, Target, ChevronRight, CheckCircle, XCircle, Zap, Shield } from "lucide-react"
import Link from "next/link"

const stakingSteps = [
  { label: "Acquire", desc: "Get SIFIX tokens via DEX or earn them by contributing reports" },
  { label: "Stake", desc: "Lock tokens to gain reporting rights and establish credibility" },
  { label: "Report", desc: "Submit verified threat intelligence to the community feed" },
  { label: "Earn / Slash", desc: "Valid reports earn token rewards; false reports are slashed" },
]

const bountySteps = [
  {
    icon: Shield,
    number: "01",
    title: "Protocol Posts Bounty",
    desc: "DEX, bridge, or lending protocol locks USDC escrow for exploit detection",
    color: "text-accent-blue",
    bg: "bg-accent-blue/10",
    border: "border-accent-blue/15",
  },
  {
    icon: Zap,
    number: "02",
    title: "SIFIX Agent Detects",
    desc: "AI agent identifies pre-exploit patterns or vulnerabilities before loss occurs",
    color: "text-accent-yellow",
    bg: "bg-accent-yellow/10",
    border: "border-accent-yellow/15",
  },
  {
    icon: Target,
    number: "03",
    title: "Auto-Release via Contract",
    desc: "Smart contract releases bounty automatically — SIFIX takes 10–15% protocol fee",
    color: "text-accent-green",
    bg: "bg-accent-green/10",
    border: "border-accent-green/15",
  },
]

export function Web3EconomySection() {
  return (
    <section className="py-24 relative bg-canvas overflow-hidden">
      {/* Atmospheric glow */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-accent-yellow/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="px-4 sm:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-yellow/10 border border-accent-yellow/20 rounded-full mb-8 backdrop-blur-md">
              <Coins className="w-4 h-4 text-accent-yellow" />
              <span className="text-xs font-medium text-accent-yellow tracking-wide">WEB3 NATIVE ECONOMY</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[56px] leading-[1.1] tracking-tight text-ink mb-6 font-normal">
              Self-sustaining<br />security economy
            </h2>
            <p className="text-lg text-body max-w-2xl mx-auto">
              Token-incentivized reporting and automated bounty distribution — aligned incentives
              that grow stronger with every contributor.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Staking Economy */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent-yellow/10 rounded-xl flex items-center justify-center">
                  <Coins className="w-5 h-5 text-accent-yellow" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Staking + Reputation Economy</h3>
                  <p className="text-sm text-white/50">Stake to report, earn from accuracy</p>
                </div>
              </div>

              {/* Steps timeline */}
              <div className="relative mb-6">
                {stakingSteps.map((step, i) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-accent-yellow/10 border border-accent-yellow/25 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-accent-yellow">{i + 1}</span>
                      </div>
                      {i < stakingSteps.length - 1 && (
                        <div className="w-px flex-1 bg-white/[0.08] my-1" />
                      )}
                    </div>
                    <div className={`${i < stakingSteps.length - 1 ? "pb-5" : "pb-0"}`}>
                      <p className="text-sm font-semibold text-white mb-0.5">{step.label}</p>
                      <p className="text-xs text-white/50">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Earn / Slash visual */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-accent-green/[0.06] border border-accent-green/15 rounded-xl p-4">
                  <CheckCircle className="w-5 h-5 text-accent-green mb-2" />
                  <p className="text-sm font-semibold text-white">Valid Report</p>
                  <p className="text-xs text-white/50">+SIFIX rewards + reputation boost</p>
                </div>
                <div className="bg-accent-red/[0.06] border border-accent-red/15 rounded-xl p-4">
                  <XCircle className="w-5 h-5 text-accent-red mb-2" />
                  <p className="text-sm font-semibold text-white">False Report</p>
                  <p className="text-xs text-white/50">Stake slashed proportionally</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/staking"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-yellow/15 border border-accent-yellow/25 text-accent-yellow text-sm font-medium rounded-xl hover:bg-accent-yellow/25 transition-colors"
                >
                  Preview Staking <ChevronRight className="w-4 h-4" />
                </Link>
                <span className="px-2.5 py-1 bg-white/[0.05] border border-white/10 text-white/50 text-xs font-medium rounded-full">
                  Coming Soon
                </span>
              </div>
            </motion.div>

            {/* Right: Bounty Infrastructure */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent-blue/10 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-accent-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Bounty Infrastructure</h3>
                  <p className="text-sm text-white/50">Automated exploit detection → auto-release</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {bountySteps.map((step, i) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex gap-4 bg-white/[0.03] border ${step.border} rounded-xl p-4 hover:bg-white/[0.05] transition-colors`}
                  >
                    <div className={`w-10 h-10 ${step.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <step.icon className={`w-5 h-5 ${step.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono text-white/25">{step.number}</span>
                        <p className="text-sm font-semibold text-white">{step.title}</p>
                      </div>
                      <p className="text-xs text-white/50">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-accent-yellow/[0.05] border border-accent-yellow/15 rounded-xl p-4 mb-6">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1.5">Protocol Fee</p>
                <p className="text-sm text-white/70">
                  SIFIX collects{" "}
                  <span className="text-accent-yellow font-semibold">10–15%</span>{" "}
                  of every successfully resolved bounty, paid automatically via smart contract.
                </p>
              </div>

              <button
                disabled
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.05] border border-white/10 text-white/40 text-sm font-medium rounded-xl cursor-not-allowed"
              >
                Bounty Platform — Coming Soon
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
