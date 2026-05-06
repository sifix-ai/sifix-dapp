"use client";

import { useState } from "react";
import { ArrowRight, Menu, X, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero2() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link href="/dashboard">
              <button className="h-10 px-6 rounded-full bg-gradient-0g text-white text-sm font-medium hover:shadow-glow-accent transition-all flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Launch Dashboard
              </button>
            </Link>
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

        {/* Hero section */}
        <div className="container mx-auto mt-12 px-4 text-center">
          <h1 className="mx-auto max-w-5xl text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            Protect Your
            <span className="block mt-2 bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] bg-clip-text text-transparent">
              Web3 Wallet
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            AI-powered transaction interception, real-time risk simulation,
            and on-chain threat reputation system. Complete protection for your crypto assets.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link href="/dashboard">
              <button className="h-12 rounded-full bg-gradient-0g px-8 text-base font-medium text-white hover:shadow-glow-accent transition-all flex items-center">
                Launch Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </Link>
            <a href="https://github.com/sifix-ai" target="_blank" rel="noopener noreferrer">
              <button className="h-12 rounded-full border border-white/[0.2] px-8 text-base font-medium text-white hover:bg-white/[0.08] transition-all">
                View Documentation
              </button>
            </a>
          </div>

          {/* Hero Image/Preview */}
          <div className="relative mx-auto my-20 w-full max-w-6xl">
            <div className="absolute inset-0 rounded bg-gradient-0g blur-[10rem] opacity-20" />
            <div className="relative border border-white/[0.1] rounded-2xl bg-white/[0.02] backdrop-blur-sm p-8">
              <div className="aspect-video bg-gradient-0g rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Shield className="w-24 h-24 text-white mx-auto mb-4" />
                  <p className="text-xl text-white font-semibold">SIFIX Dashboard Preview</p>
                  <p className="text-white/60 text-sm mt-2">Real-time threat detection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
