"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { Shield, Zap, Brain, Wallet, Globe, ArrowRight } from "lucide-react"
import { AnimatedBeam } from "@/components/ui/animated-beam"

export function PipelineSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const walletRef = useRef<HTMLDivElement>(null)
  const extensionRef = useRef<HTMLDivElement>(null)
  const aiRef = useRef<HTMLDivElement>(null)
  const chainRef = useRef<HTMLDivElement>(null)

  const steps = [
    {
      id: "wallet",
      ref: walletRef,
      icon: Wallet,
      title: "Your Wallet",
      description: "Connect Web3 wallet",
    },
    {
      id: "extension",
      ref: extensionRef,
      icon: Shield,
      title: "SIFIX Extension",
      description: "Intercept transactions",
    },
    {
      id: "ai",
      ref: aiRef,
      icon: Brain,
      title: "AI Agent",
      description: "Analyze & simulate",
    },
    {
      id: "chain",
      ref: chainRef,
      icon: Globe,
      title: "0G Chain",
      description: "Store threat data",
    },
  ]

  return (
    <section className="py-12 relative overflow-hidden bg-[#0a0118]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-violet-50 mb-2">
              How It{" "}
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-sm text-violet-300/60">
              Four simple steps to protect your assets
            </p>
          </motion.div>

          {/* Pipeline */}
          <div ref={containerRef} className="relative">
            {/* Animated Beams */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={walletRef}
                toRef={extensionRef}
                curvature={0}
                duration={3}
                delay={0}
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={extensionRef}
                toRef={aiRef}
                curvature={0}
                duration={3}
                delay={0.5}
              />
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={aiRef}
                toRef={chainRef}
                curvature={0}
                duration={3}
                delay={1}
              />
            </div>

            {/* Steps */}
            <div className="grid md:grid-cols-4 gap-6 relative z-20">
              {steps.map((step, i) => (
                <motion.div
                  key={step.id}
                  ref={step.ref}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative"
                >
                  {/* Step Number */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                    {i + 1}
                  </div>

                  {/* Card */}
                  <div className="bg-violet-500/5 border border-violet-500/20 rounded-lg p-4 backdrop-blur-sm">
                    {/* Icon */}
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg flex items-center justify-center mb-3 shadow-lg">
                      <step.icon className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>

                    {/* Content */}
                    <h3 className="text-sm font-bold text-violet-50 mb-1">{step.title}</h3>
                    <p className="text-xs text-violet-300/60">{step.description}</p>
                  </div>

                  {/* Arrow */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-30">
                      <ArrowRight className="w-6 h-6 text-violet-500/30" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
