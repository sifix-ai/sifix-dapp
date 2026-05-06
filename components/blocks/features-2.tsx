"use client"

import { Zap, Shield, Brain, Lock, Eye, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const CardDecorator = () => (
  <div className="absolute inset-0 overflow-hidden rounded-2xl">
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(139, 92, 246, 0.4) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(139, 92, 246, 0.4) 1px, transparent 1px)
        `,
        backgroundSize: "24px 24px",
      }}
    />
  </div>
)

export function Features() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description:
        "GPT-4 powered threat detection analyzes smart contracts and transaction patterns with 95%+ accuracy.",
      color: "#8b5cf6",
      glow: "rgba(139, 92, 246, 0.3)",
      bg: "bg-violet-500/10",
    },
    {
      icon: Eye,
      title: "Real-Time Interception",
      description:
        "Intercepts transactions before execution, simulates outcomes, and provides instant risk assessment.",
      color: "#ec4899",
      glow: "rgba(236, 72, 153, 0.3)",
      bg: "bg-pink-500/10",
    },
    {
      icon: Shield,
      title: "On-Chain Reputation",
      description:
        "Decentralized threat intelligence stored on 0G Chain. Community-driven security that gets smarter over time.",
      color: "#a78bfa",
      glow: "rgba(167, 139, 250, 0.3)",
      bg: "bg-violet-400/10",
    },
    {
      icon: Lock,
      title: "Zero Trust Architecture",
      description:
        "Every transaction is treated as potentially malicious until proven safe. No assumptions, complete protection.",
      color: "#f472b6",
      glow: "rgba(244, 114, 182, 0.3)",
      bg: "bg-pink-400/10",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Sub-second analysis powered by 0G's high-performance infrastructure. Security without compromise.",
      color: "#818cf8",
      glow: "rgba(129, 140, 248, 0.3)",
      bg: "bg-indigo-400/10",
    },
    {
      icon: Sparkles,
      title: "Earn Rewards",
      description:
        "Report threats, climb the leaderboard, and earn reputation tokens. Get paid to make Web3 safer.",
      color: "#c084fc",
      glow: "rgba(192, 132, 252, 0.3)",
      bg: "bg-purple-400/10",
    },
  ]

  return (
    <section id="features" className="py-32 relative bg-gradient-to-b from-[#0a0118] to-[#1a1625]">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-bold text-violet-400 uppercase tracking-wide">FEATURES</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight text-violet-50 mb-6">
              Complete Protection
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                From Every Angle
              </span>
            </h2>
            <p className="text-xl text-violet-300/60 max-w-3xl mx-auto leading-relaxed">
              Multi-layered security powered by AI, blockchain, and community intelligence
            </p>
          </div>

          {/* Features grid - 3 columns */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="relative overflow-hidden border-violet-500/20 bg-violet-500/5 backdrop-blur-sm hover:border-violet-500/40 transition-all duration-300 group card-hover"
              >
                <CardDecorator />
                
                {/* Gradient glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(ellipse at center, ${feature.glow} 0%, transparent 70%)`,
                  }}
                />
                
                <CardHeader className="relative z-10">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div
                      className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300"
                      style={{ backgroundColor: feature.color }}
                    />
                    <div
                      className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${feature.bg}`}
                    >
                      <feature.icon
                        className="w-7 h-7 transition-colors"
                        style={{ color: feature.color }}
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-violet-50 mb-3 group-hover:text-violet-100 transition-colors">
                    {feature.title}
                  </h3>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-violet-300/60 leading-relaxed group-hover:text-violet-300/80 transition-colors">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-violet-400/40 text-lg font-medium">
              All features included. No premium tiers. Just complete protection.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
