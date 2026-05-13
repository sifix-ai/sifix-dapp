"use client"

import { motion } from "framer-motion"
import { Shield, Database, Brain, Lock } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ReactNode } from "react"

export function SolutionSection() {
  const features = [
    {
      icon: Shield,
      title: "Verifiable Agentic ID",
      description: "AI agents with decentralized identity that can be verified and audited across domains.",
    },
    {
      icon: Brain,
      title: "0G Compute Powered",
      description: "Transaction simulation and AI analysis running on scalable 0G Compute infrastructure.",
    },
    {
      icon: Database,
      title: "0G Storage",
      description: "Immutable threat intelligence stored permanently on decentralized 0G Storage network.",
    },
    {
      icon: Lock,
      title: "BYOAI Flexibility",
      description: "Bring Your Own AI provider for customizable security analysis that fits your needs.",
    },
  ]

  return (
    <section id="how-it-works" className="bg-canvas py-16 md:py-32">
      <div className="@container px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/15 rounded-full mb-8 backdrop-blur-md">
            <Shield className="w-4 h-4 text-accent-blue" />
            <span className="text-xs font-medium text-white tracking-wide">THE SOLUTION</span>
          </div>
          <h2 className="text-balance font-display text-4xl md:text-5xl lg:text-[64px] leading-[1.1] tracking-tight font-normal text-ink mb-4">
            Built on 0G Infrastructure
          </h2>
          <p className="mt-4 text-lg text-body max-w-2xl mx-auto">
            Four-layer defense system powered by 0G Compute, Storage, and Agentic ID
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-4 mx-auto grid max-w-sm gap-6 *:text-center md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="group shadow-none border-white/15 bg-white/[0.04] backdrop-blur-md hover:bg-white/[0.08] transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardDecorator>
                    <feature.icon className="size-6 text-accent-blue" aria-hidden />
                  </CardDecorator>
                  <h3 className="mt-6 font-medium text-ink">{feature.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-charcoal leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div aria-hidden className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
    <div className="absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l border-white/20 bg-surface-card rounded-lg backdrop-blur-sm">
      {children}
    </div>
  </div>
)
