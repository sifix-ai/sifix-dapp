"use client"

import { motion } from "framer-motion"
import { Building2, Radio, Shield, ChevronRight, ArrowRight, Zap, Globe, Lock } from "lucide-react"
import Link from "next/link"

const apiTiers = [
  {
    name: "Basic",
    price: "Free",
    limit: "100 calls / day",
    features: ["Address risk lookup", "Risk score + level", "Basic threat tags"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$499 / mo",
    limit: "10,000 calls / day",
    features: ["Real-time threat feed", "Webhook alerts", "Batch scanning", "Priority support"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    limit: "Unlimited",
    features: ["SLA guarantee", "White-label integration", "Dedicated support", "Custom data feeds"],
    highlight: false,
  },
]

const protectionFeatures = [
  { icon: Shield, text: "Automatic transaction risk screening" },
  { icon: Radio, text: "Real-time blacklist sync to your contracts" },
  { icon: Globe, text: '"Secured by SIFIX" badge for user trust' },
  { icon: Lock, text: "Insurance risk scoring for premium calculation" },
  { icon: Zap, text: "Sub-100ms API response time" },
]

export function B2BRevenueSection() {
  return (
    <section className="py-24 relative bg-canvas overflow-hidden">
      {/* Atmospheric glow */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[700px] h-[700px] bg-accent-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-3xl" />
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-green/10 border border-accent-green/20 rounded-full mb-8 backdrop-blur-md">
              <Building2 className="w-4 h-4 text-accent-green" />
              <span className="text-xs font-medium text-accent-green tracking-wide">B2B · RECURRING REVENUE</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[56px] leading-[1.1] tracking-tight text-ink mb-6 font-normal">
              Enterprise Revenue<br />Infrastructure
            </h2>
            <p className="text-lg text-body max-w-2xl mx-auto">
              Protocols, wallets, and insurance platforms pay to integrate SIFIX threat
              intelligence — real-time protection their users demand.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Threat Intel API Tiers */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent-green/10 rounded-xl flex items-center justify-center">
                  <Radio className="w-5 h-5 text-accent-green" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Threat Intelligence API</h3>
                  <p className="text-sm text-white/50">Real-time threat data feed for DeFi protocols</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {apiTiers.map((tier, i) => (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`relative rounded-xl p-4 border transition-all duration-300 ${
                      tier.highlight
                        ? "bg-accent-green/[0.07] border-accent-green/25 shadow-lg shadow-accent-green/5"
                        : "bg-white/[0.03] border-white/[0.08] hover:border-white/15"
                    }`}
                  >
                    {tier.highlight && (
                      <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 bg-accent-green text-black text-xs font-bold rounded-full">
                        POPULAR
                      </span>
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-white">{tier.name}</p>
                        <p className="text-xs text-white/40">{tier.limit}</p>
                      </div>
                      <p className={`text-lg font-bold ${tier.highlight ? "text-accent-green" : "text-white"}`}>
                        {tier.price}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tier.features.map((f) => (
                        <span key={f} className="text-xs text-white/50 bg-white/[0.04] px-2 py-1 rounded-md">
                          {f}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link
                href="/dashboard/marketplace"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-green text-black text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Get API Access <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Right: Protection-as-a-Service */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent-blue/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Protection-as-a-Service</h3>
                  <p className="text-sm text-white/50">White-label security layer for protocols & wallets</p>
                </div>
              </div>

              <div className="relative bg-white/[0.04] border border-white/10 rounded-2xl p-6 mb-5 backdrop-blur-md overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent-blue/[0.08] rounded-full blur-2xl pointer-events-none" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-blue/10 border border-accent-blue/20 rounded-lg mb-4">
                    <Shield className="w-3.5 h-3.5 text-accent-blue" />
                    <span className="text-xs text-accent-blue font-medium">Secured by SIFIX</span>
                  </div>
                  <p className="text-sm text-white/60 mb-5">
                    Embed SIFIX as your protocol&apos;s security backbone. Users get protected
                    automatically — without leaving your interface.
                  </p>
                  <div className="space-y-3">
                    {protectionFeatures.map((f, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-accent-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <f.icon className="w-3.5 h-3.5 text-accent-blue" />
                        </div>
                        <span className="text-sm text-white/70">{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 mb-6">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Revenue Model</p>
                <p className="text-sm text-white/70">
                  Protocol licenses from{" "}
                  <span className="text-accent-green font-semibold">$2,000–$50,000 / mo</span>{" "}
                  based on TVL. Insurance platforms pay per risk score query.
                </p>
              </div>

              <Link
                href="/dashboard/marketplace"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.07] border border-white/15 text-white text-sm font-medium rounded-xl hover:bg-white/[0.11] transition-colors"
              >
                Apply for Integration <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
