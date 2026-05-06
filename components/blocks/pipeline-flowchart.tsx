"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import {
  Shield,
  Brain,
  Wallet,
  CheckCircle,
  XCircle,
  ChevronDown,
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
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#120a20] to-[#0f0a1f]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-violet-50 mb-4">
              Transaction{" "}
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                Flow
              </span>
            </h2>
            <p className="text-base text-violet-300/60 max-w-xl mx-auto">
              How SIFIX protects your transactions in real-time
            </p>
          </motion.div>

          {/* Flowchart */}
          <div ref={containerRef} className="relative">
            {/* Animated Beams */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <AnimatedBeam containerRef={containerRef} fromRef={startRef} toRef={interceptRef} curvature={0} duration={3} delay={0} pathWidth={2} />
              <AnimatedBeam containerRef={containerRef} fromRef={interceptRef} toRef={decisionRef} curvature={0} duration={3} delay={0.5} pathWidth={2} />
              <AnimatedBeam containerRef={containerRef} fromRef={decisionRef} toRef={simulateRef} curvature={0} duration={3} delay={1} pathWidth={2} />
              <AnimatedBeam containerRef={containerRef} fromRef={decisionRef} toRef={directRef} curvature={0} duration={3} delay={1} pathWidth={2} />
              <AnimatedBeam containerRef={containerRef} fromRef={simulateRef} toRef={analyzeRef} curvature={0} duration={3} delay={1.5} pathWidth={2} />
              <AnimatedBeam containerRef={containerRef} fromRef={directRef} toRef={approveRef} curvature={0} duration={3} delay={1.5} pathWidth={2} />
              <AnimatedBeam containerRef={containerRef} fromRef={analyzeRef} toRef={safeRef} curvature={0} duration={3} delay={2} pathWidth={2} />
              <AnimatedBeam containerRef={containerRef} fromRef={safeRef} toRef={approveRef} curvature={0} duration={3} delay={2.5} pathWidth={2} />
              <AnimatedBeam containerRef={containerRef} fromRef={analyzeRef} toRef={blockRef} curvature={0} duration={3} delay={2} pathWidth={2} />
            </div>

            {/* Flowchart Nodes */}
            <div className="space-y-5 relative z-20">
              {/* Level 1 */}
              <div className="flex justify-center">
                <motion.div ref={startRef} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-80">
                  <div className="bg-blue-500/10 border-2 border-blue-500/30 rounded-xl p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Wallet className="w-6 h-6 text-blue-400" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-1">Step 0</div>
                        <div className="text-base font-bold text-blue-50">User Initiates Transaction</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ChevronDown className="w-6 h-6 text-violet-500/40" strokeWidth={2} />
              </div>

              {/* Level 2 */}
              <div className="flex justify-center">
                <motion.div ref={interceptRef} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="w-80">
                  <div className="bg-violet-500/10 border-2 border-violet-500/30 rounded-xl p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-violet-400" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-violet-400 uppercase tracking-wide mb-1">Step 1</div>
                        <div className="text-base font-bold text-violet-50">SIFIX Intercepts</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ChevronDown className="w-6 h-6 text-violet-500/40" strokeWidth={2} />
              </div>

              {/* Level 3 */}
              <div className="flex justify-center">
                <motion.div ref={decisionRef} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="w-80">
                  <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Brain className="w-6 h-6 text-yellow-400" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-yellow-400 uppercase tracking-wide mb-1">Decision</div>
                        <div className="text-base font-bold text-yellow-50">Check Transaction</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Arrows */}
              <div className="flex justify-center gap-40 px-20">
                <ChevronDown className="w-6 h-6 text-violet-500/40" strokeWidth={2} />
                <ChevronDown className="w-6 h-6 text-violet-500/40" strokeWidth={2} />
              </div>

              {/* Level 4 */}
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <motion.div ref={simulateRef} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
                  <div className="bg-indigo-500/10 border-2 border-indigo-500/30 rounded-xl p-5 h-full">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Brain className="w-6 h-6 text-indigo-400" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-1">Route A</div>
                        <div className="text-base font-bold text-indigo-50">Simulate in Sandbox</div>
                        <div className="text-xs text-indigo-300/60 mt-1">Unknown contract</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div ref={directRef} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
                  <div className="bg-cyan-500/10 border-2 border-cyan-500/30 rounded-xl p-5 h-full">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-cyan-400" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-1">Route B</div>
                        <div className="text-base font-bold text-cyan-50">Known Safe Contract</div>
                        <div className="text-xs text-cyan-300/60 mt-1">Whitelisted dApp</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center md:justify-start md:px-20">
                <ChevronDown className="w-6 h-6 text-violet-500/40" strokeWidth={2} />
              </div>

              {/* Level 5 */}
              <div className="flex justify-center md:justify-start">
                <motion.div ref={analyzeRef} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8 }} className="w-80">
                  <div className="bg-purple-500/10 border-2 border-purple-500/30 rounded-xl p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Brain className="w-6 h-6 text-purple-400" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-1">Step 2</div>
                        <div className="text-base font-bold text-purple-50">AI Risk Analysis</div>
                        <div className="text-xs text-purple-300/60 mt-1">GPT-4 examines code</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Arrows */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="flex flex-col items-center">
                  <ChevronDown className="w-6 h-6 text-green-500/40" strokeWidth={2} />
                </div>
                <div className="flex flex-col items-center">
                  <ChevronDown className="w-6 h-6 text-red-500/40" strokeWidth={2} />
                </div>
                <div className="flex flex-col items-center">
                  <ChevronDown className="w-6 h-6 text-emerald-500/40" strokeWidth={2} />
                </div>
              </div>

              {/* Level 6 */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <motion.div ref={safeRef} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1 }}>
                  <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-5 h-full">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-green-400" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-1">Safe</div>
                        <div className="text-base font-bold text-green-50">Allow Transaction</div>
                        <div className="text-xs text-green-300/60 mt-1">No threats found</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div ref={blockRef} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1.2 }}>
                  <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-5 h-full">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-6 h-6 text-red-400" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-1">Blocked</div>
                        <div className="text-base font-bold text-red-50">Threat Detected</div>
                        <div className="text-xs text-red-300/60 mt-1">Transaction blocked</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div ref={approveRef} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1.4 }}>
                  <div className="bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl p-5 h-full">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-emerald-400" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1">Complete</div>
                        <div className="text-base font-bold text-emerald-50">User Approves</div>
                        <div className="text-xs text-emerald-300/60 mt-1">Transaction sent</div>
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
