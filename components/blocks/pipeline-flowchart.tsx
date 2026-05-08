"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import {
  Shield,
  Brain,
  Wallet,
  CheckCircle,
  XCircle,
  ArrowDown,
} from "lucide-react"
import { AnimatedBeam } from "@/components/ui/animated-beam"

export function PipelineSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<HTMLDivElement>(null)
  const interceptRef = useRef<HTMLDivElement>(null)
  const decisionRef = useRef<HTMLDivElement>(null)
  const simulateRef = useRef<HTMLDivElement>(null)
  const directRef = useRef<HTMLDivElement>(null)
  const analyzeRef = useRef<HTMLDivElement>(null)
  const safeRef = useRef<HTMLDivElement>(null)
  const blockRef = useRef<HTMLDivElement>(null)
  const approveRef = useRef<HTMLDivElement>(null)

  return (
    <section id="how-it-works" className="py-32 relative bg-canvas">
      {/* Atmospheric glow - blue accent - subtle for long section */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-accent-blue-glow rounded-full blur-3xl opacity-12" />
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header - Resend Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-hairline-strong rounded-full mb-8">
              <span className="text-xs font-medium text-body tracking-wide">TRANSACTION FLOW</span>
            </div>
            <h2 className="font-display text-[76.8px] leading-[1.0] tracking-[-0.768px] text-ink mb-6 font-normal">
              How it works
            </h2>
            <p className="text-lg text-body max-w-2xl">
              Real-time protection powered by AI and decentralized infrastructure
            </p>
          </motion.div>

          {/* Flowchart */}
          <div ref={containerRef} className="relative">
            {/* Animated Beams */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <AnimatedBeam containerRef={containerRef} fromRef={startRef} toRef={interceptRef} curvature={0} duration={10} delay={0} pathWidth={2} />
              <AnimatedBeam containerRef={containerRef} fromRef={interceptRef} toRef={decisionRef} curvature={0} duration={10} delay={0.5} pathWidth={2} />
              <AnimatedBeam containerRef={containerRef} fromRef={decisionRef} toRef={simulateRef} curvature={0} duration={10} delay={1} pathWidth={2} />
              <AnimatedBeam containerRef={containerRef} fromRef={decisionRef} toRef={directRef} curvature={0} duration={10} delay={1} pathWidth={2} />
              <AnimatedBeam containerRef={containerRef} fromRef={simulateRef} toRef={analyzeRef} curvature={0} duration={10} delay={1.5} pathWidth={2} />
              <AnimatedBeam containerRef={containerRef} fromRef={directRef} toRef={approveRef} curvature={0} duration={10} delay={1.5} pathWidth={2} />
              <AnimatedBeam containerRef={containerRef} fromRef={analyzeRef} toRef={safeRef} curvature={0} duration={10} delay={2} pathWidth={2} />
              <AnimatedBeam containerRef={containerRef} fromRef={safeRef} toRef={approveRef} curvature={0} duration={10} delay={2.5} pathWidth={2} />
              <AnimatedBeam containerRef={containerRef} fromRef={analyzeRef} toRef={blockRef} curvature={0} duration={10} delay={2} pathWidth={2} />
            </div>

            {/* Flowchart Nodes */}
            <div className="space-y-6 relative z-20">
              {/* Level 1 */}
              <div className="flex justify-center">
                <motion.div ref={startRef} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-80">
                  <div className="feature-card">
                    <div className="flex items-center gap-4">
                      <Wallet className="w-6 h-6 text-accent-blue flex-shrink-0" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-ash uppercase tracking-wide mb-1">Step 0</div>
                        <div className="text-base font-medium text-ink">User Initiates Transaction</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowDown className="w-5 h-5 text-hairline-strong" strokeWidth={1.5} />
              </div>

              {/* Level 2 */}
              <div className="flex justify-center">
                <motion.div ref={interceptRef} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="w-80">
                  <div className="feature-card">
                    <div className="flex items-center gap-4">
                      <Shield className="w-6 h-6 text-ink flex-shrink-0" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-ash uppercase tracking-wide mb-1">Step 1</div>
                        <div className="text-base font-medium text-ink">SIFIX Intercepts</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowDown className="w-5 h-5 text-hairline-strong" strokeWidth={1.5} />
              </div>

              {/* Level 3 */}
              <div className="flex justify-center">
                <motion.div ref={decisionRef} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="w-80">
                  <div className="feature-card">
                    <div className="flex items-center gap-4">
                      <Brain className="w-6 h-6 text-accent-yellow flex-shrink-0" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-ash uppercase tracking-wide mb-1">Decision</div>
                        <div className="text-base font-medium text-ink">Check Transaction</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Arrows */}
              <div className="flex justify-center gap-40 px-20">
                <ArrowDown className="w-5 h-5 text-hairline-strong" strokeWidth={1.5} />
                <ArrowDown className="w-5 h-5 text-hairline-strong" strokeWidth={1.5} />
              </div>

              {/* Level 4 */}
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <motion.div ref={simulateRef} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
                  <div className="feature-card h-full">
                    <div className="flex items-center gap-4">
                      <Brain className="w-6 h-6 text-ink flex-shrink-0" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-ash uppercase tracking-wide mb-1">Route A</div>
                        <div className="text-base font-medium text-ink">Simulate in Sandbox</div>
                        <div className="text-xs text-charcoal mt-1">Unknown contract</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div ref={directRef} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
                  <div className="feature-card h-full">
                    <div className="flex items-center gap-4">
                      <CheckCircle className="w-6 h-6 text-accent-green flex-shrink-0" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-ash uppercase tracking-wide mb-1">Route B</div>
                        <div className="text-base font-medium text-ink">Known Safe Contract</div>
                        <div className="text-xs text-charcoal mt-1">Whitelisted dApp</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center md:justify-start md:px-20">
                <ArrowDown className="w-5 h-5 text-hairline-strong" strokeWidth={1.5} />
              </div>

              {/* Level 5 */}
              <div className="flex justify-center md:justify-start">
                <motion.div ref={analyzeRef} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8 }} className="w-80">
                  <div className="feature-card">
                    <div className="flex items-center gap-4">
                      <Brain className="w-6 h-6 text-ink flex-shrink-0" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-ash uppercase tracking-wide mb-1">Step 2</div>
                        <div className="text-base font-medium text-ink">AI Risk Analysis</div>
                        <div className="text-xs text-charcoal mt-1">GPT-4 examines code</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Arrows */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="flex flex-col items-center">
                  <ArrowDown className="w-5 h-5 text-accent-green" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col items-center">
                  <ArrowDown className="w-5 h-5 text-accent-red" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col items-center">
                  <ArrowDown className="w-5 h-5 text-accent-green" strokeWidth={1.5} />
                </div>
              </div>

              {/* Level 6 */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <motion.div ref={safeRef} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1 }}>
                  <div className="feature-card h-full">
                    <div className="flex items-center gap-4">
                      <CheckCircle className="w-6 h-6 text-accent-green flex-shrink-0" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-ash uppercase tracking-wide mb-1">Safe</div>
                        <div className="text-base font-medium text-ink">Allow Transaction</div>
                        <div className="text-xs text-charcoal mt-1">No threats found</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div ref={blockRef} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1.2 }}>
                  <div className="feature-card h-full">
                    <div className="flex items-center gap-4">
                      <XCircle className="w-6 h-6 text-accent-red flex-shrink-0" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-ash uppercase tracking-wide mb-1">Blocked</div>
                        <div className="text-base font-medium text-ink">Threat Detected</div>
                        <div className="text-xs text-charcoal mt-1">Transaction blocked</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div ref={approveRef} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1.4 }}>
                  <div className="feature-card h-full">
                    <div className="flex items-center gap-4">
                      <CheckCircle className="w-6 h-6 text-accent-green flex-shrink-0" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-ash uppercase tracking-wide mb-1">Complete</div>
                        <div className="text-base font-medium text-ink">User Approves</div>
                        <div className="text-xs text-charcoal mt-1">Transaction sent</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
