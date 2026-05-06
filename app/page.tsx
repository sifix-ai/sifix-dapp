"use client"

import Link from "next/link"
import { Shield, ArrowRight, CheckCircle, Activity, Trophy, Zap, Globe, Users } from "lucide-react"
import { Hero2 } from '@/components/ui/hero-2'
import { FeaturesSection } from '@/components/ui/features-section'
import { Features } from '@/components/blocks/features-2'
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Hero Section */}
      <Hero2 />

      {/* Features Section */}
      <FeaturesSection />

      {/* Features 2 Section */}
      <Features />

      {/* How It Works */}
      <section id="how-it-works" className="py-32 bg-gradient-to-b from-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-violet-600/20 to-indigo-600/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-100 mb-6">
                Protected in 4 Simple
                <br />
                <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Steps</span>
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Get started in minutes and protect your wallet from day one
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, i) => (
                <div key={i} className="relative group">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-all duration-300 card-hover backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 shadow-lg shadow-indigo-500/30">
                        {item.step}
                      </div>
                      <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-700">
                        <item.icon className="w-6 h-6 text-indigo-400" strokeWidth={2.5} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-100 mb-3">{item.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center p-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl hover:border-indigo-500/50 transition-all shadow-premium card-hover">
                  <stat.icon className="w-8 h-8 text-indigo-400 mx-auto mb-4" strokeWidth={2.5} />
                  <div className={`text-5xl font-bold text-slate-100 mb-3`}>{stat.value}</div>
                  <div className="text-sm text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Background Paths */}
      <BackgroundPaths title="Ready to Protect Your Crypto" />

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <span className="text-sm text-slate-400">
                © 2026 SIFIX. Built for 0G Chain APAC Hackathon.
              </span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://github.com/sifix-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-400 hover:text-slate-100 transition-colors font-semibold"
              >
                GitHub
              </a>
              <a
                href="https://chainscan-newton.0g.ai/address/0x544a39149d5169E4e1bDf7F8492804224CB70152"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-400 hover:text-slate-100 transition-colors font-semibold"
              >
                Contract
              </a>
              <a
                href="https://0g.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-400 hover:text-slate-100 transition-colors font-semibold"
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
