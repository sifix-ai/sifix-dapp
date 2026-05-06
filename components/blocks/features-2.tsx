"use client"

import { Zap, Settings2, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const CardDecorator = () => (
  <div className="absolute inset-0 overflow-hidden rounded-2xl">
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 99, 99, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 99, 99, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: "24px 24px",
      }}
    />
  </div>
)

export function Features() {
  const features = [
    {
      icon: Zap,
      title: "Customizable",
      description:
        "Tailor the platform to your needs with flexible configuration options and extensible architecture.",
    },
    {
      icon: Settings2,
      title: "You have full control",
      description:
        "Maintain complete ownership of your data and workflows. No vendor lock-in, no compromises.",
    },
    {
      icon: Sparkles,
      title: "Powered By AI",
      description:
        "Leverage advanced AI capabilities to analyze transactions and detect threats with 95%+ accuracy.",
    },
  ]

  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Built for
              <br />
              <span className="text-[#FF6363]">Security & Control</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Enterprise-grade protection with the flexibility you need
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="relative overflow-hidden border-white/[0.08] bg-white/[0.02] backdrop-blur-sm hover:border-[#FF6363]/30 transition-all duration-300 group"
              >
                <CardDecorator />
                <CardHeader className="relative z-10">
                  <div className="w-12 h-12 bg-[#FF6363]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#FF6363]/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-[#FF6363]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-white/60 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
