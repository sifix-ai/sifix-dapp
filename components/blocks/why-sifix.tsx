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
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#150a20] to-[#1a0a25]">
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-pink-600/5 to-violet-600/5 rounded-full blur-3xl" />

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
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 rounded-full mb-4">
              <Shield className="w-3 h-3 text-violet-400" />
              <span className="text-xs font-semibold text-violet-400">Why Choose SIFIX</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-violet-50 mb-3">
              The Difference Between{" "}
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Losing Everything
              </span>{" "}
              and{" "}
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                Staying Safe
              </span>
            </h2>
          </motion.div>

          {/* Comparison Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Without SIFIX */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20 rounded-xl p-5 backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                    <X className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-violet-50">Without SIFIX</h3>
                    <p className="text-xs text-red-400">Vulnerable</p>
                  </div>
                </div>

                {/* List */}
                <div className="space-y-2">
                  {comparisons.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="flex items-start gap-2 p-2 rounded-lg bg-red-500/5 border border-red-500/10"
                    >
                      <div className="flex-shrink-0 w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center mt-0.5">
                        <X className="w-3 h-3 text-red-400" strokeWidth={2.5} />
                      </div>
                      <p className="text-sm text-violet-300/80 pt-0.5">{item.without}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* With SIFIX */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-violet-500/5 to-pink-500/5 border border-violet-500/20 rounded-xl p-5 backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-violet-50">With SIFIX</h3>
                    <p className="text-xs text-green-400">Fully protected</p>
                  </div>
                </div>

                {/* List */}
                <div className="space-y-2">
                  {comparisons.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 + 0.4 }}
                      className="flex items-start gap-2 p-2 rounded-lg bg-violet-500/5 border border-violet-500/10"
                    >
                      <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-green-400" strokeWidth={2.5} />
                      </div>
                      <p className="text-sm text-violet-300/80 pt-0.5">{item.with}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
