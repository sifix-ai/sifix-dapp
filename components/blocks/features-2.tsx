"use client"

import { Zap, Shield, Brain, Lock, Eye, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const CardDecorator = () => (
  <div className="absolute inset-0 overflow-hidden rounded-2xl">
    <div
      className="absolute inset-0 opacity-[0.02]"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(99, 102, 241, 0.3) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
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
      color: "#6366f1",
      gradient: "from-indigo-50/50 to-indigo-50/10"
    },
    {
      icon: Eye,
      title: "Real-Time Interception",
      description:
        "Intercepts transactions before execution, simulates outcomes, and provides instant risk assessment.",
      color: "#14b8a6",
      gradient: "from-teal-50/50 to-teal-50/10"
    },
    {
      icon: Shield,
      title: "On-Chain Reputation",
      description:
        "Decentralized threat intelligence stored on 0G Chain. Community-driven security that gets smarter over time.",
      color: "#8b5cf6",
      gradient: "from-violet-50/50 to-violet-50/10"
    },
    {
      icon: Lock,
      title: "Zero Trust Architecture",
      description:
        "Every transaction is treated as potentially malicious until proven safe. No assumptions, complete protection.",
      color: "#f59e0b",
      gradient: "from-amber-50/50 to-amber-50/10"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Sub-second analysis powered by 0G's high-performance infrastructure. Security without compromise.",
      color: "#10b981",
      gradient: "from-emerald-50/50 to-emerald-50/10"
    },
    {
      icon: Sparkles,
      title: "Earn Rewards",
      description:
        "Report threats, climb the leaderboard, and earn reputation tokens. Get paid to make Web3 safer.",
      color: "#ec4899",
      gradient: "from-pink-50/50 to-pink-50/10"
    },
  ]

  return (
    <section id="features" className="py-32 relative bg-gradient-to-b from-white to-zinc-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-bold text-indigo-600 uppercase tracking-wide">FEATURES</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight text-zinc-900 mb-6">
              Complete Protection
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                From Every Angle
              </span>
            </h2>
            <p className="text-xl text-zinc-600 max-w-3xl mx-auto leading-relaxed">
              Multi-layered security powered by AI, blockchain, and community intelligence
            </p>
          </div>

          {/* Features grid - 3 columns */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="relative overflow-hidden border-zinc-200 bg-white backdrop-blur-sm hover:border-zinc-300 transition-all duration-300 group card-hover shadow-premium"
              >
                <CardDecorator />
                
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <CardHeader className="relative z-10">
                  {/* Icon with dynamic color */}
                  <div className="relative mb-6">
                    <div 
                      className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                      style={{ backgroundColor: feature.color }}
                    />
                    <div 
                      className="relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm"
                      style={{ backgroundColor: `${feature.color}15` }}
                    >
                      <feature.icon 
                        className="w-7 h-7 transition-colors" 
                        style={{ color: feature.color }}
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3 group-hover:text-zinc-900 transition-colors">
                    {feature.title}
                  </h3>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-zinc-600 leading-relaxed group-hover:text-zinc-700 transition-colors">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-zinc-500 text-lg font-medium">
              All features included. No premium tiers. Just complete protection.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
