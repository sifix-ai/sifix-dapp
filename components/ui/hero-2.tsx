"use client";

import { useState } from "react";
import { ArrowRight, Menu, X, Shield, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@/components/connect-button";
import { useAccount } from "wagmi";

export function Hero2() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isConnected } = useAccount();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0118]">
      {/* Animated gradient orbs - purple/pink/indigo ONLY */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-gradient-to-br from-violet-600/25 to-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/20 to-violet-600/15 rounded-full blur-3xl" />
        <div className="absolute top-[40%] left-[30%] w-[500px] h-[500px] bg-gradient-to-br from-pink-600/10 to-violet-600/10 rounded-full blur-3xl" />
      </div>

      {/* Subtle dot grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle, #8b5cf6 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Content container */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto flex items-center justify-between px-4 py-6 mt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/30">
              <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-violet-100 tracking-tight">SIFIX</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-violet-300/70 hover:text-violet-100 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-violet-300/70 hover:text-violet-100 transition-colors">How It Works</a>
            <a href="https://github.com/sifix-ai" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-violet-300/70 hover:text-violet-100 transition-colors">GitHub</a>
            {isConnected ? (
              <Link href="/dashboard">
                <Button size="sm" className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all">
                  <Shield className="w-4 h-4 mr-2" />
                  Launch Dashboard
                </Button>
              </Link>
            ) : (
              <ConnectButton />
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? <X className="h-6 w-6 text-violet-100" /> : <Menu className="h-6 w-6 text-violet-100" />}
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex flex-col p-4 bg-[#0a0118]/95 backdrop-blur-xl md:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-violet-100">SIFIX</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6 text-violet-100" />
              </button>
            </div>
            <div className="mt-8 flex flex-col space-y-6">
              <a href="#features" className="text-lg font-medium text-violet-100 py-2">Features</a>
              <a href="#how-it-works" className="text-lg font-medium text-violet-100 py-2">How It Works</a>
              <a href="https://github.com/sifix-ai" className="text-lg font-medium text-violet-100 py-2">GitHub</a>
            </div>
          </div>
        )}

        {/* Badge */}
        <div className="mx-auto mt-8 flex max-w-fit items-center justify-center space-x-2 rounded-full bg-violet-500/10 backdrop-blur-sm px-5 py-2 border border-violet-500/20">
          <Sparkles className="h-4 w-4 text-violet-400" />
          <span className="text-sm font-semibold text-violet-200">
            AI-Powered Security on 0G Chain
          </span>
          <ArrowRight className="h-4 w-4 text-violet-400" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto mt-20 px-4">
          <div className="text-center max-w-6xl mx-auto">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] text-violet-50 tracking-tight">
              Your Crypto&apos;s
              <br />
              <span className="relative inline-block mt-3">
                <span className="relative z-10 bg-gradient-to-r from-violet-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                  Last Line of Defense
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-violet-500/40 via-pink-500/40 to-violet-500/40 blur-xl" />
              </span>
            </h1>
            <p className="mx-auto mt-10 max-w-3xl text-xl md:text-2xl text-violet-300/70 leading-relaxed font-medium">
              AI-powered security that <span className="text-violet-100 font-bold">intercepts</span>, <span className="text-pink-300 font-bold">analyzes</span>, and <span className="text-violet-100 font-bold">blocks</span> malicious transactions before they drain your wallet.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isConnected ? (
                <Link href="/dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white px-10 py-7 text-lg font-bold shadow-xl shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105">
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
                <Button size="lg" variant="outline" className="border-2 border-violet-500/30 text-violet-100 hover:bg-violet-500/10 hover:border-violet-500/50 px-10 py-7 text-lg font-bold backdrop-blur-sm transition-all">
                  View on GitHub
                </Button>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-violet-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                <span className="font-semibold">Live on 0G Newton</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-violet-400" />
                <span className="font-semibold">95%+ Detection Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span className="font-semibold">Powered by GPT-4</span>
              </div>
            </div>
          </div>

          {/* Hero Visual - Dashboard Preview */}
          <div className="relative mx-auto mt-24 w-full max-w-7xl">
            {/* Glow effect */}
            <div className="absolute -inset-20 bg-gradient-to-r from-violet-600/20 via-pink-600/15 to-violet-600/20 blur-3xl opacity-60" />
            
            {/* Main dashboard preview */}
            <div className="relative border-2 border-violet-500/20 rounded-3xl bg-[#1a1625]/50 shadow-premium-lg p-2 backdrop-blur-sm">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-violet-500/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500" />
                  <div className="w-3 h-3 rounded-full bg-violet-500" />
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                </div>
                <div className="flex-1 mx-4 px-4 py-1.5 bg-[#0a0118] rounded-lg text-xs text-violet-400/60 font-mono border border-violet-500/10">
                  sifix.ai/dashboard
                </div>
              </div>
              
              {/* Dashboard content */}
              <div className="aspect-[16/10] bg-gradient-to-br from-[#0a0118] via-[#1a1625] to-[#0a0118] rounded-b-2xl p-8 relative overflow-hidden">
                {/* Subtle dot grid */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: `radial-gradient(circle, #8b5cf6 1px, transparent 1px)`,
                  backgroundSize: '40px 40px'
                }} />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  {/* Large shield icon */}
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-pink-500 blur-2xl opacity-30 animate-pulse-slow" />
                    <div className="relative w-32 h-32 bg-gradient-to-br from-violet-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl shadow-violet-500/30 transform hover:scale-110 transition-transform duration-300">
                      <Shield className="w-16 h-16 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-violet-50 mb-3">Real-Time Protection</h3>
                  <p className="text-violet-300/60 text-lg mb-8 max-w-md text-center">
                    Every transaction analyzed by AI before execution
                  </p>
                  
                  {/* Stats row - NO GREEN */}
                  <div className="flex gap-6 mt-4">
                    <div className="px-6 py-3 bg-violet-500/10 border border-violet-500/20 rounded-xl backdrop-blur-sm">
                      <div className="text-2xl font-bold text-violet-300">10K+</div>
                      <div className="text-xs text-violet-400/60 mt-1 font-semibold">Protected</div>
                    </div>
                    <div className="px-6 py-3 bg-pink-500/10 border border-pink-500/20 rounded-xl backdrop-blur-sm">
                      <div className="text-2xl font-bold text-pink-300">1.2K+</div>
                      <div className="text-xs text-violet-400/60 mt-1 font-semibold">Blocked</div>
                    </div>
                    <div className="px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl backdrop-blur-sm">
                      <div className="text-2xl font-bold text-indigo-300">99.9%</div>
                      <div className="text-xs text-violet-400/60 mt-1 font-semibold">Uptime</div>
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
