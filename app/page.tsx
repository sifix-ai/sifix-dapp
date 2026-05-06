"use client"

import Link from "next/link"
import { Shield, ArrowRight, CheckCircle, Activity, Trophy, Zap, Globe, Users } from "lucide-react"
import { Hero2 } from '@/components/ui/hero-2'
import { FeaturesSection } from '@/components/ui/features-section'
import { Features } from '@/components/blocks/features-2'
import { BackgroundPaths } from "@/components/ui/background-paths"

export default function Home() {
  const stats = [
    { value: "10K+", label: "Protected Wallets", icon: Users, color: "violet" },
    { value: "50K+", label: "Transactions Analyzed", icon: Activity, color: "pink" },
    { value: "1.2K+", label: "Threats Detected", icon: Shield, color: "indigo" },
    { value: "99.9%", label: "Uptime Guarantee", icon: Trophy, color: "cyan" }
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
    <div className="min-h-screen bg-gradient-to-b from-[#0a0118] to-[#1a1625]">
      {/* Hero Section */}
      <Hero2 />

      {/* Features Section */}
      <FeaturesSection />

      {/* Features 2 Section */}
      <Features />

      {/* How It Works */}
      <section id="how-it-works" className="py-32 bg-gradient-to-b from-[#1a1625] to-[#0a0118] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-600/15 to-violet-600/15 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-violet-50 mb-6">
                Protected in 4 Simple
                <br />
                <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">Steps</span>
              </h2>
              <p className="text-xl text-violet-300/60 max-w-2xl mx-auto">
                Get started in minutes and protect your wallet from day one
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, i) => (
                <div key={i} className="relative group">
                  <div className="bg-violet-500/5 border border-violet-500/20 rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-all duration-300 card-hover backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 shadow-lg shadow-violet-500/30">
                        {item.step}
                      </div>
                      <div className="w-12 h-12 bg-[#0a0118] rounded-xl flex items-center justify-center border border-violet-500/20">
                        <item.icon className="w-6 h-6 text-violet-400" strokeWidth={2.5} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-violet-50 mb-3">{item.title}</h3>
                    <p className="text-violet-300/60 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - NO GREEN */}
      <section className="py-32 bg-[#0a0118]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, i) => {
                const colorClasses = {
                  violet: "from-violet-500/10 to-violet-600/5 border-violet-500/20 text-violet-300",
                  pink: "from-pink-500/10 to-pink-600/5 border-pink-500/20 text-pink-300",
                  indigo: "from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 text-indigo-300",
                  cyan: "from-cyan-500/10 to-cyan-600/5 border-cyan-500/20 text-cyan-300"
                }[stat.color];
                
                const iconColorClasses = {
                  violet: "text-violet-400",
                  pink: "text-pink-400",
                  indigo: "text-indigo-400",
                  cyan: "text-cyan-400"
                }[stat.color];
                
                return (
                  <div key={i} className={`text-center p-8 bg-gradient-to-br ${colorClasses} border rounded-2xl hover:border-violet-500/40 transition-all shadow-premium card-hover`}>
                    <stat.icon className={`w-8 h-8 ${iconColorClasses} mx-auto mb-4`} strokeWidth={2.5} />
                    <div className={`text-5xl font-bold text-violet-50 mb-3`}>{stat.value}</div>
                    <div className="text-sm text-violet-400/60 font-semibold uppercase tracking-wider">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Background Paths */}
      <BackgroundPaths title="Ready to Protect Your Crypto" />

      {/* Footer */}
      <footer className="border-t border-violet-500/10 py-12 bg-[#0a0118]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-violet-400" />
              <span className="text-sm text-violet-400/60">
                © 2026 SIFIX. Built for 0G Chain APAC Hackathon.
              </span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://github.com/sifix-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-violet-400/60 hover:text-violet-100 transition-colors font-semibold"
              >
                GitHub
              </a>
              <a
                href="https://chainscan-newton.0g.ai/address/0x544a39149d5169E4e1bDf7F8492804224CB70152"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-violet-400/60 hover:text-violet-100 transition-colors font-semibold"
              >
                Contract
              </a>
              <a
                href="https://0g.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-violet-400/60 hover:text-violet-100 transition-colors font-semibold"
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
