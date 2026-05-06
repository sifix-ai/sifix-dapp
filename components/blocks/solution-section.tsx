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
      color: "from-violet-500 to-violet-600",
      delay: 0,
    },
    {
      step: "02",
      icon: Zap,
      title: "Simulate",
      description: "Run transaction in sandbox environment to predict outcome",
      color: "from-pink-500 to-pink-600",
      delay: 0.1,
    },
    {
      step: "03",
      icon: Brain,
      title: "Analyze",
      description: "GPT-4 AI agent examines contract code, patterns, and risks",
      color: "from-indigo-500 to-indigo-600",
      delay: 0.2,
    },
    {
      step: "04",
      icon: CheckCircle,
      title: "Protect",
      description: "Get clear risk assessment and block threats before execution",
      color: "from-cyan-500 to-cyan-600",
      delay: 0.3,
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#1f0a1a] to-[#120a20]">
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-5">
              <Shield className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-semibold text-violet-400 uppercase tracking-wide">The Solution</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-violet-50 mb-4">
              How SIFIX{" "}
              <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Protects You
              </span>
            </h2>
            <p className="text-base text-violet-300/60 max-w-xl mx-auto">
              Four-layer defense system powered by AI and decentralized infrastructure
            </p>
          </motion.div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: step.delay }}
                whileHover={{ scale: 1.03 }}
                className="relative group"
              >
                {/* Step number badge */}
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-lg z-10">
                  {step.step}
                </div>

                <div className="bg-gradient-to-br from-violet-500/5 to-pink-500/5 border-2 border-violet-500/20 rounded-xl p-5 backdrop-blur-sm h-full group-hover:border-violet-500/40 transition-colors">
                  {/* Icon */}
                  <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-lg flex items-center justify-center mb-4 shadow-lg`}>
                    <step.icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-bold text-violet-50 mb-2">{step.title}</h3>
                  <p className="text-sm text-violet-300/60 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
