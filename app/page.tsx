"use client"

import Link from "next/link"
import { Shield, ArrowRight, CheckCircle, Activity, Trophy, Zap, Globe, Users } from "lucide-react"
import { Hero2 } from "@/components/ui/hero-2"
import { Features } from "@/components/ui/features"
import { BackgroundPaths } from "@/components/ui/background-paths"

export default function Home() {
  const stats = [
    { value: "10K+", label: "Protected Wallets", icon: Users },
    { value: "50K+", label: "Transactions Analyzed", icon: Activity },
    { value: "1.2K+", label: "Threats Detected", icon: Shield },
    { value: "99.9%", label: "Uptime Guarantee", icon: Trophy }
  ]

  const howItWorks = [
    {
      step: "01",
      title: "Install Extension",
      description: "Add SIFIX browser extension to your wallet. Works with MetaMask, Coinbase Wallet, and more.",
      icon: Shield
    },
    {
      step: "02",
      title: "Transaction Interception",
      description: "When you try to sign a transaction, SIFIX intercepts it and simulates the operation.",
      icon: Activity
    },
    {
      step: "03",
      title: "AI Risk Analysis",
      description: "Our AI agent analyzes the transaction for threats using GPT-4 with 95%+ accuracy.",
      icon: Zap
    },
    {
      step: "04",
      title: "Get Protected",
      description: "Receive clear risk assessment and block malicious transactions before it's too late.",
      icon: CheckCircle
    }
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <Hero2 />

      {/* Features Section */}
      <Features />

      {/* How It Works */}
      <section id="how-it-works" className="py-32 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
                Protected in 4 Simple
                <br />
                <span className="text-[#4ecdc4]">Steps</span>
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Get started in minutes and protect your wallet from day one
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, i) => (
                <div key={i} className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-0g rounded-xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                      {item.step}
                    </div>
                    <div className="w-12 h-12 bg-white/[0.05] rounded-xl flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-[#ff6b6b]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/60 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center p-8 bg-white/[0.02] border border-white/[0.08] rounded-2xl hover:border-[#ff6b6b]/30 transition-all">
                  <stat.icon className="w-8 h-8 text-[#ff6b6b] mx-auto mb-4" />
                  <div className={`text-5xl font-bold text-white mb-3`}>{stat.value}</div>
                  <div className="text-sm text-white/60 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Background */}
      <BackgroundPaths title="Ready to Protect Your Assets" />

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-12 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#ff6b6b]" />
              <span className="text-sm text-white/60">
                © 2026 SIFIX. Built for 0G Chain APAC Hackathon.
              </span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://github.com/sifix-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/60 hover:text-white transition-colors font-medium"
              >
                GitHub
              </a>
              <a
                href="https://chainscan-newton.0g.ai/address/0x544a39149d5169E4e1bDf7F8492804224CB70152"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/60 hover:text-white transition-colors font-medium"
              >
                Contract
              </a>
              <a
                href="https://0g.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/60 hover:text-white transition-colors font-medium"
              >
                0G Chain
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
