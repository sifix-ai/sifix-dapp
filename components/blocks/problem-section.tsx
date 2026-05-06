"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Ghost, TrendingDown, Receipt } from "lucide-react"

export function ProblemSection() {
  const threats = [
    {
      icon: Receipt,
      title: "Malicious Contracts",
      description: "Hidden code that drains your wallet after approval",
      color: "from-red-500 to-orange-500",
      delay: 0,
    },
    {
      icon: Ghost,
      title: "Phishing Attacks",
      description: "Fake websites that look like legitimate dApps",
      color: "from-purple-500 to-pink-500",
      delay: 0.1,
    },
    {
      icon: TrendingDown,
      title: "Rug Pulls",
      description: "Developers abandon projects after raising funds",
      color: "from-yellow-500 to-amber-500",
      delay: 0.2,
    },
    {
      icon: AlertTriangle,
      title: "Approval Scams",
      description: "Unlimited spending permissions you didn't notice",
      color: "from-rose-500 to-red-600",
      delay: 0.3,
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#160a25] to-[#1f0a1a]">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-5">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">The Problem</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-violet-50 mb-4">
              Web3 is a{" "}
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Minefield
              </span>
            </h2>
            <p className="text-base text-violet-300/60 max-w-xl mx-auto">
              Every day, hackers steal millions through sophisticated attacks. Even experienced users fall victim.
            </p>
          </motion.div>

          {/* Threat Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {threats.map((threat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: threat.delay }}
                whileHover={{ scale: 1.03 }}
                className="relative group"
              >
                <div className="relative bg-gradient-to-br from-red-500/5 to-orange-500/5 border-2 border-red-500/20 rounded-xl p-5 backdrop-blur-sm h-full">
                  <div className={`w-12 h-12 bg-gradient-to-br ${threat.color} rounded-lg flex items-center justify-center mb-4 shadow-lg`}>
                    <threat.icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-base font-bold text-violet-50 mb-2">{threat.title}</h3>
                  <p className="text-sm text-violet-300/60 leading-relaxed">{threat.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Reality Check */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center gap-5">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                    <AlertTriangle className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Reality Check</div>
                  <p className="text-xl md:text-2xl font-bold text-violet-50 mb-2">
                    Over <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">$2 Billion</span> Stolen in 2024
                  </p>
                  <p className="text-sm text-violet-300/60">
                    That's how much was stolen from Web3 users through these attacks
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
