"use client"

import Link from "next/link"
import { Shield, AlertTriangle, Search as SearchIcon, TrendingUp, ArrowRight, ExternalLink } from "lucide-react"
import { CTASection } from "@/components/ui/hero-dithering-card"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#07080a]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#07080a]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#FF6363]" />
            <span className="font-semibold text-white tracking-tight">SIFIX</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/search" className="text-sm text-white/60 hover:text-white transition-colors font-medium">
              Search
            </Link>
            <Link href="/threats" className="text-sm text-white/60 hover:text-white transition-colors font-medium">
              Threats
            </Link>
            <Link href="/analytics" className="text-sm text-white/60 hover:text-white transition-colors font-medium">
              Analytics
            </Link>
            <a 
              href="https://github.com/sifix-ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-white transition-colors font-medium"
            >
              GitHub
            </a>
          </nav>

          <Link href="/search">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50 bg-[#FF6363] text-white shadow hover:bg-[#FF6363]/90 h-9 rounded-lg px-4 text-sm">
              Launch App
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF6363]/5 via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-full text-sm text-white/80 mb-6">
              <span className="w-2 h-2 bg-[#FF6363] rounded-full animate-pulse"></span>
              Built for 0G APAC Hackathon 2026
            </div>

            {/* Headline - Linear style: light weight, tight tracking */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-[-0.04em] text-white mb-6 leading-[1.05]">
              AI-Powered Wallet<br />
              <span className="text-white/70">Security Agent</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
              Autonomous AI that intercepts transactions, simulates risks, and reports threats to on-chain reputation system. Protect your wallet before you sign.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/search">
                <button className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6363]/20 disabled:pointer-events-none disabled:opacity-50 bg-[#FF6363] text-white shadow-lg shadow-[#FF6363]/20 hover:bg-[#FF6363]/90 hover:shadow-xl hover:shadow-[#FF6363]/30 hover:scale-105 active:scale-95 h-12 rounded-full px-8 w-full sm:w-auto">
                  Check Address Reputation
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
              
              <a 
                href="https://github.com/sifix-ai/sifix-extension" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50 border border-white/[0.08] bg-white/[0.02] text-white shadow-sm hover:bg-white/[0.05] hover:border-white/[0.12] h-12 rounded-full px-8 w-full sm:w-auto">
                  Install Extension
                  <ExternalLink className="w-4 h-4" />
                </button>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-light text-white mb-1 tracking-tight">24/7</div>
                <div className="text-sm text-white/60 font-light">AI Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-white mb-1 tracking-tight">&lt;100ms</div>
                <div className="text-sm text-white/60 font-light">Analysis Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-white mb-1 tracking-tight">0G Chain</div>
                <div className="text-sm text-white/60 font-light">On-Chain Data</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Stripe-inspired cards with blue-tinted shadows */}
      <section className="py-24 border-t border-white/[0.08]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white text-center mb-16">
              How SIFIX Protects You
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div 
                className="group p-8 bg-white/[0.02] border border-white/[0.08] rounded-2xl hover:border-[#FF6363]/30 transition-all duration-300 hover:shadow-[0_20px_40px_-20px_rgba(255,99,99,0.3)]"
              >
                <div className="w-12 h-12 bg-[#FF6363]/10 border border-[#FF6363]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="w-6 h-6 text-[#FF6363]" />
                </div>
                <h3 className="text-xl font-medium text-white mb-3 tracking-tight">
                  Transaction Interception
                </h3>
                <p className="text-white/60 leading-relaxed font-light">
                  Browser extension intercepts every transaction before you sign. No malicious TX gets through.
                </p>
              </div>

              {/* Card 2 */}
              <div 
                className="group p-8 bg-white/[0.02] border border-white/[0.08] rounded-2xl hover:border-[#55b3ff]/30 transition-all duration-300 hover:shadow-[0_20px_40px_-20px_rgba(85,179,255,0.3)]"
              >
                <div className="w-12 h-12 bg-[#55b3ff]/10 border border-[#55b3ff]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <SearchIcon className="w-6 h-6 text-[#55b3ff]" />
                </div>
                <h3 className="text-xl font-medium text-white mb-3 tracking-tight">
                  AI Risk Analysis
                </h3>
                <p className="text-white/60 leading-relaxed font-light">
                  GPT-4 powered agent simulates transactions and analyzes risks in real-time with 95%+ accuracy.
                </p>
              </div>

              {/* Card 3 */}
              <div 
                className="group p-8 bg-white/[0.02] border border-white/[0.08] rounded-2xl hover:border-[#5fc992]/30 transition-all duration-300 hover:shadow-[0_20px_40px_-20px_rgba(95,201,146,0.3)]"
              >
                <div className="w-12 h-12 bg-[#5fc992]/10 border border-[#5fc992]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-6 h-6 text-[#5fc992]" />
                </div>
                <h3 className="text-xl font-medium text-white mb-3 tracking-tight">
                  On-Chain Reputation
                </h3>
                <p className="text-white/60 leading-relaxed font-light">
                  Threat reports stored on 0G Chain. Build decentralized reputation system for addresses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Dithering Effect */}
      <CTASection />

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#FF6363]" />
              <span className="text-sm text-white/60 font-light">
                © 2026 SIFIX. Built by Team Butuh Uwang.
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
              <Link 
                href="/analytics"
                className="text-sm text-white/60 hover:text-white transition-colors font-medium"
              >
                Analytics
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
