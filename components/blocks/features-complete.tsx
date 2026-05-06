"use client"

import { motion } from "framer-motion"
import {
  Zap,
  MessageSquare,
  DollarSign,
  AlertTriangle,
  Star,
  Database,
  Sparkles,
} from "lucide-react"

export function FeaturesComplete() {
  const features = [
    {
      icon: Zap,
      title: "Real-Time Analysis",
      description: "Every transaction analyzed in milliseconds by AI",
      gradient: "from-yellow-400 to-orange-500",
      bgGradient: "from-yellow-500/10 to-orange-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      icon: MessageSquare,
      title: "AI Explanations",
      description: "Get clear, natural language explanations of what each transaction does",
      gradient: "from-blue-400 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: DollarSign,
      title: "Gas Preview",
      description: "See exact gas costs before confirming any transaction",
      gradient: "from-green-400 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/20",
    },
    {
      icon: AlertTriangle,
      title: "Threat Alerts",
      description: "Instant warnings for malicious contracts, phishing, and suspicious patterns",
      gradient: "from-red-400 to-pink-500",
      bgGradient: "from-red-500/10 to-pink-500/10",
      borderColor: "border-red-500/20",
    },
    {
      icon: Star,
      title: "On-Chain Reputation",
      description: "Community-driven security scores for contracts and addresses",
      gradient: "from-purple-400 to-violet-500",
      bgGradient: "from-purple-500/10 to-violet-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      icon: Database,
      title: "Decentralized Storage",
      description: "All threat evidence permanently stored on 0G Chain",
      gradient: "from-indigo-400 to-blue-500",
      bgGradient: "from-indigo-500/10 to-blue-500/10",
      borderColor: "border-indigo-500/20",
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#0f0a1f] to-[#150a20]">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-violet-600/5 to-pink-600/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full mb-4">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span className="text-xs font-semibold text-violet-400">Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-violet-50 mb-3">
              Complete{" "}
              <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Protection
              </span>
            </h2>
            <p className="text-base text-violet-300/60">
              Powerful features for everyday users and Web3 natives
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative group"
              >
                <div
                  className={`relative bg-gradient-to-br ${feature.bgGradient} ${feature.borderColor} border rounded-xl p-4 backdrop-blur-sm h-full group-hover:border-violet-500/40 transition-all duration-300`}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-3 shadow-lg`}
                  >
                    <feature.icon className="w-5 h-5 text-white" strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <h3 className="text-sm font-bold text-violet-50 mb-1">{feature.title}</h3>
                  <p className="text-xs text-violet-300/60 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <div className="px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-lg text-xs text-violet-400">
              Free to use
            </div>
            <div className="px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-lg text-xs text-violet-400">
              Open source
            </div>
            <div className="px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-lg text-xs text-violet-400">
              Privacy-first
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
