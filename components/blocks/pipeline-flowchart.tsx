"use client"

import { useRef, forwardRef } from "react"
import { motion } from "framer-motion"
import {
  Shield,
  Brain,
  Wallet,
  CheckCircle,
  XCircle,
  Send,
  Ban,
} from "lucide-react"

import { AnimatedBeam } from "@/components/ui/animated-beam"
import { cn } from "@/lib/utils"

const Node = forwardRef<
  HTMLDivElement,
  {
    className?: string
    icon?: React.ReactNode
    variant?: "process" | "decision"
    glowColor?: string
    borderColor?: string
  }
>(({ className, icon, variant = "process", glowColor, borderColor }, ref) => {
  const variants = {
    process: "rounded-2xl",
    decision: "rotate-45 rounded-xl",
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        {glowColor && (
          <div
            className="absolute inset-0 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ backgroundColor: glowColor }}
          />
        )}

        <div
          ref={ref}
          className={cn(
            "relative z-10 w-20 h-20 bg-white/[0.04] border-2 backdrop-blur-md flex items-center justify-center transition-all duration-300",
            variants[variant],
            className
          )}
          style={{
            borderColor: borderColor || "rgba(255,255,255,0.15)",
          }}
        >
          {variant === "decision" ? (
            <div className="-rotate-45">{icon}</div>
          ) : (
            icon
          )}
        </div>
      </div>
    </div>
  )
})

Node.displayName = "Node"

export function PipelineSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const walletRef = useRef<HTMLDivElement>(null)
  const extensionRef = useRef<HTMLDivElement>(null)
  const analystRef = useRef<HTMLDivElement>(null)

  const safeRef = useRef<HTMLDivElement>(null)
  const threatRef = useRef<HTMLDivElement>(null)

  const processRef = useRef<HTMLDivElement>(null)
  const blockRef = useRef<HTMLDivElement>(null)

  return (
    <section
      id="how-it-works"
      className="py-32 relative bg-canvas overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full blur-3xl opacity-10 bg-accent-blue-glow" />
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/15 rounded-full mb-8 backdrop-blur-md">
              <Shield className="w-4 h-4 text-accent-green" />
              <span className="text-xs font-medium text-white tracking-wide">
                TRANSACTION FLOW
              </span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl lg:text-[64px] leading-[1.1] tracking-tight text-ink mb-6 font-normal">
              How it works
            </h2>

            <p className="text-lg text-body max-w-2xl mx-auto">
              Real-time protection powered by 0G Compute, Storage, and Agentic
              ID
            </p>
          </motion.div>

          {/* FLOWCHART */}
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-canvas/50 backdrop-blur-sm p-20"
          >
            <div className="relative flex items-center justify-between min-h-[500px]">
              {/* LEFT FLOW */}
              <div className="flex items-center gap-24">
                {/* Wallet */}
                <div className="flex flex-col items-center gap-4">
                  <Node
                    ref={walletRef}
                    icon={
                      <Wallet
                        className="w-8 h-8 text-accent-blue"
                        strokeWidth={1.5}
                      />
                    }
                    glowColor="rgba(59,130,246,0.2)"
                    borderColor="rgba(59,130,246,0.35)"
                  />

                  <div className="text-center">
                    <p className="text-sm font-semibold text-ink">Wallet</p>
                    <p className="text-xs text-charcoal mt-1">
                      Transaction initiated
                    </p>
                  </div>
                </div>

                {/* Extension */}
                <div className="flex flex-col items-center gap-4">
                  <Node
                    ref={extensionRef}
                    icon={
                      <Shield
                        className="w-8 h-8 text-accent-green"
                        strokeWidth={1.5}
                      />
                    }
                    glowColor="rgba(16,185,129,0.2)"
                    borderColor="rgba(16,185,129,0.35)"
                  />

                  <div className="text-center">
                    <p className="text-sm font-semibold text-ink">
                      Extension
                    </p>
                    <p className="text-xs text-charcoal mt-1">
                      Intercepts & simulates
                    </p>
                  </div>
                </div>

                {/* Analyst */}
                <div className="flex flex-col items-center gap-4">
                  <Node
                    ref={analystRef}
                    variant="decision"
                    icon={
                      <Brain
                        className="w-8 h-8 text-accent-yellow"
                        strokeWidth={1.5}
                      />
                    }
                    glowColor="rgba(251,191,36,0.2)"
                    borderColor="rgba(251,191,36,0.35)"
                  />

                  <div className="text-center">
                    <p className="text-sm font-semibold text-ink">
                      Agent Analyst
                    </p>
                    <p className="text-xs text-charcoal mt-1">
                      AI analyzes risk
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT FLOW */}
              <div className="relative flex flex-col justify-between h-[420px]">
                {/* TOP */}
                <div className="flex items-center gap-28">
                  {/* Safe */}
                  <div className="flex flex-col items-center gap-4">
                    <Node
                      ref={safeRef}
                      icon={
                        <CheckCircle
                          className="w-7 h-7 text-accent-green"
                          strokeWidth={2}
                        />
                      }
                      glowColor="rgba(16,185,129,0.2)"
                      borderColor="rgba(16,185,129,0.35)"
                    />

                    <div className="text-center">
                      <p className="text-sm font-semibold text-ink">Safe</p>
                      <p className="text-xs text-charcoal mt-1">
                        Report stored on 0G
                      </p>
                    </div>
                  </div>

                  {/* Process */}
                  <div className="flex flex-col items-center gap-4">
                    <Node
                      ref={processRef}
                      icon={
                        <Send
                          className="w-8 h-8 text-accent-blue"
                          strokeWidth={1.5}
                        />
                      }
                      glowColor="rgba(59,130,246,0.2)"
                      borderColor="rgba(59,130,246,0.35)"
                    />

                    <div className="text-center">
                      <p className="text-sm font-semibold text-ink">
                        Process
                      </p>
                      <p className="text-xs text-charcoal mt-1">
                        Execute transaction
                      </p>
                    </div>
                  </div>
                </div>

                {/* BOTTOM */}
                <div className="flex items-center gap-28">
                  {/* Threat */}
                  <div className="flex flex-col items-center gap-4">
                    <Node
                      ref={threatRef}
                      icon={
                        <XCircle
                          className="w-7 h-7 text-accent-red"
                          strokeWidth={2}
                        />
                      }
                      glowColor="rgba(239,68,68,0.2)"
                      borderColor="rgba(239,68,68,0.35)"
                    />

                    <div className="text-center">
                      <p className="text-sm font-semibold text-ink">
                        Threat
                      </p>
                      <p className="text-xs text-charcoal mt-1">
                        Report stored on 0G
                      </p>
                    </div>
                  </div>

                  {/* Block */}
                  <div className="flex flex-col items-center gap-4">
                    <Node
                      ref={blockRef}
                      icon={
                        <Ban
                          className="w-8 h-8 text-accent-red"
                          strokeWidth={1.5}
                        />
                      }
                      glowColor="rgba(239,68,68,0.2)"
                      borderColor="rgba(239,68,68,0.35)"
                    />

                    <div className="text-center">
                      <p className="text-sm font-semibold text-ink">
                        Block
                      </p>

                      <p className="text-xs text-charcoal mt-1">
                        User warned or blocked
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BEAMS */}

            {/* wallet -> extension */}
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={walletRef}
              toRef={extensionRef}
              duration={3}
              curvature={0}
              pathColor="#3b82f6"
              pathWidth={2}
            />

            {/* extension -> analyst */}
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={extensionRef}
              toRef={analystRef}
              duration={3}
              curvature={0}
              pathColor="#10b981"
              pathWidth={2}
            />

            {/* analyst -> safe */}
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={analystRef}
              toRef={safeRef}
              duration={3}
              curvature={-60}
              endYOffset={-10}
              pathColor="#10b981"
              pathWidth={2}
            />

            {/* safe -> process */}
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={safeRef}
              toRef={processRef}
              duration={3}
              curvature={0}
              pathColor="#3b82f6"
              pathWidth={2}
            />

            {/* analyst -> threat */}
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={analystRef}
              toRef={threatRef}
              duration={3}
              curvature={60}
              endYOffset={10}
              pathColor="#ef4444"
              pathWidth={2}
            />

            {/* threat -> block */}
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={threatRef}
              toRef={blockRef}
              duration={3}
              curvature={0}
              pathColor="#ef4444"
              pathWidth={2}
            />

            {/* block -> process */}
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={blockRef}
              toRef={processRef}
              duration={3}
              curvature={-120}
              startYOffset={-10}
              endYOffset={20}
              pathColor="#f59e0b"
              pathWidth={2}
            />

            {/* LABEL */}
            <div className="pointer-events-none absolute right-[6%] bottom-[50%] rounded-md border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-sm text-yellow-400 backdrop-blur-sm">
              continue with risk
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}