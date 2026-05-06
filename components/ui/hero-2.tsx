"use client";

import { useState } from "react";
import { ArrowRight, Menu, X, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@/components/connect-button";
import { useAccount } from "wagmi";

export function Hero2() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isConnected } = useAccount();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Gradient background */}
      <div className="flex flex-col items-end absolute -right-60 -top-10 blur-xl z-0">
        <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-[#ff6b6b] to-[#4ecdc4]"></div>
        <div className="h-[10rem] rounded-full w-[90rem] z-1 bg-gradient-to-b blur-[6rem] from-[#ff6b6b]/60 to-[#4ecdc4]/60"></div>
        <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-[#ff6b6b]/80 to-[#4ecdc4]/80"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto flex items-center justify-between px-4 py-4 mt-6">
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-0g text-white">
              <Shield className="w-5 h-5" />
            </div>
            <span className="ml-2 text-xl font-bold text-white">SIFIX</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">How It Works</a>
            <a href="https://github.com/sifix-ai" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-white transition-colors">GitHub</a>
            {/* Smart button: show Launch Dashboard if connected, otherwise show Connect Wallet */}
            {isConnected ? (
              <Link href="/dashboard">
                <Button size="sm" className="bg-[#FF6363] hover:bg-[#FF6363]/90 text-white shadow-lg hover:shadow-[0_0_20px_rgba(255,99,99,0.3)] transition-all">
                  <Shield className="w-4 h-4 mr-2" />
                  Launch Dashboard
                </Button>
              </Link>
            ) : (
              <ConnectButton />
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex flex-col p-4 bg-[#0a0a0f]/95 md:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-0g text-white">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="ml-2 text-xl font-bold text-white">SIFIX</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="mt-8 flex flex-col space-y-6">
              <a href="#features" className="text-lg text-white py-2">Features</a>
              <a href="#how-it-works" className="text-lg text-white py-2">How It Works</a>
              <a href="https://github.com/sifix-ai" className="text-lg text-white py-2">GitHub</a>
            </div>
          </div>
        )}

        {/* Badge */}
        <div className="mx-auto mt-6 flex max-w-fit items-center justify-center space-x-2 rounded-full bg-white/[0.08] px-4 py-2 backdrop-blur-sm border border-white/[0.1]">
          <Sparkles className="h-4 w-4 text-[#ff6b6b]" />
          <span className="text-sm font-medium text-white">
            AI-Powered Security on 0G Chain
          </span>
          <ArrowRight className="h-4 w-4 text-white" />
        </div>

        {/* Hero section - REDESIGNED */}
        <div className="container mx-auto mt-16 px-4">
          {/* Main hero content */}
          <div className="text-center max-w-6xl mx-auto">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] text-white tracking-tight">
              Your Crypto's
              <br />
              <span className="relative inline-block mt-2">
                <span className="relative z-10 bg-gradient-to-r from-[#FF6363] via-[#ff8a8a] to-[#FF6363] bg-clip-text text-transparent animate-gradient">
                  Last Line of Defense
                </span>
                <div className="absolute -inset-2 bg-[#FF6363]/20 blur-3xl -z-10" />
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-xl md:text-2xl text-white/70 leading-relaxed font-medium">
              AI-powered security that <span className="text-white font-bold">intercepts</span>, <span className="text-white font-bold">analyzes</span>, and <span className="text-white font-bold">blocks</span> malicious transactions before they drain your wallet.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isConnected ? (
                <Link href="/dashboard">
                  <Button size="lg" className="bg-[#FF6363] hover:bg-[#FF6363]/90 text-white px-10 py-7 text-lg font-bold shadow-[0_0_40px_rgba(255,99,99,0.4)] hover:shadow-[0_0_60px_rgba(255,99,99,0.6)] transition-all duration-300 hover:scale-105">
                    <Shield className="mr-3 h-6 w-6" />
                    Launch Dashboard
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
              ) : (
                <div className="transform hover:scale-105 transition-transform">
                  <ConnectButton />
                </div>
              )}
              <a href="https://github.com/sifix-ai" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-7 text-lg font-bold backdrop-blur-sm hover:border-white/50 transition-all">
                  View on GitHub
                </Button>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium">Live on 0G Newton</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#FF6363]" />
                <span className="font-medium">95%+ Detection Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#4ecdc4]" />
                <span className="font-medium">Powered by GPT-4</span>
              </div>
            </div>
          </div>

          {/* Hero Visual - BOLD REDESIGN */}
          <div className="relative mx-auto mt-24 w-full max-w-7xl">
            {/* Glow effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6363]/30 via-transparent to-[#4ecdc4]/30 blur-[120px] -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6363]/20 rounded-full blur-[150px] -z-10" />
            
            {/* Main dashboard preview */}
            <div className="relative border-2 border-white/[0.15] rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl p-2 shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.1]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 mx-4 px-4 py-1.5 bg-white/[0.05] rounded-lg text-xs text-white/40 font-mono">
                  sifix.ai/dashboard
                </div>
              </div>
              
              {/* Dashboard content */}
              <div className="aspect-[16/10] bg-gradient-to-br from-[#0a0a0f] via-[#0f0f14] to-[#0a0a0f] rounded-b-2xl p-8 relative overflow-hidden">
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `linear-gradient(to right, rgba(255, 99, 99, 0.3) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(255, 99, 99, 0.3) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px'
                }} />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  {/* Large shield icon with animation */}
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-[#FF6363] blur-3xl opacity-50 animate-pulse" />
                    <div className="relative w-32 h-32 bg-gradient-to-br from-[#FF6363] to-[#ff4444] rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                      <Shield className="w-16 h-16 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  
                  {/* Text */}
                  <h3 className="text-3xl font-bold text-white mb-3">Real-Time Protection</h3>
                  <p className="text-white/60 text-lg mb-8 max-w-md text-center">
                    Every transaction analyzed by AI before execution
                  </p>
                  
                  {/* Stats row */}
                  <div className="flex gap-6 mt-4">
                    <div className="px-6 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl backdrop-blur-sm">
                      <div className="text-2xl font-bold text-[#4ecdc4]">10K+</div>
                      <div className="text-xs text-white/50 mt-1">Protected</div>
                    </div>
                    <div className="px-6 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl backdrop-blur-sm">
                      <div className="text-2xl font-bold text-[#FF6363]">1.2K+</div>
                      <div className="text-xs text-white/50 mt-1">Blocked</div>
                    </div>
                    <div className="px-6 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl backdrop-blur-sm">
                      <div className="text-2xl font-bold text-green-400">99.9%</div>
                      <div className="text-xs text-white/50 mt-1">Uptime</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
