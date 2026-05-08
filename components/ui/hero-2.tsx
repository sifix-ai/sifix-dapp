"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Menu, X, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@/components/connect-button";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";

// Animated background paths component
function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.8 + i * 0.05,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-ink"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.08 + path.id * 0.01}
            fill="none"
            initial={{ pathLength: 0.3, opacity: 0.3 }}
            animate={{
              pathLength: 1,
              opacity: [0.15, 0.3, 0.15],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function Hero2() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-canvas">
      {/* Animated Paths Background */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {/* Atmospheric glow - blue accent - subtle and clean */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-accent-blue-glow rounded-full blur-3xl opacity-20" />
      </div>

      {/* Content container */}
      <div className="relative z-10">
        {/* Navigation - Glassmorphic and Sticky */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled
              ? "bg-canvas/80 backdrop-blur-xl border-b border-hairline shadow-lg"
              : "bg-transparent"
          }`}
        >
          <div className="container mx-auto flex items-center justify-between px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Shield className="w-4 h-4 text-primary-on" strokeWidth={2.5} />
              </div>
              <span className="text-base font-medium text-ink tracking-tight">SIFIX</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-charcoal hover:text-ink transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-charcoal hover:text-ink transition-colors">How It Works</a>
              <a href="https://github.com/sifix-ai" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-charcoal hover:text-ink transition-colors">GitHub</a>
              {isConnected ? (
                <Link href="/dashboard">
                  <button className="btn-primary flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Dashboard
                  </button>
                </Link>
              ) : (
                <ConnectButton />
              )}
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <span className="sr-only">Toggle menu</span>
              {mobileMenuOpen ? <X className="h-6 w-6 text-ink" /> : <Menu className="h-6 w-6 text-ink" />}
            </button>
          </div>
        </motion.nav>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex flex-col p-8 bg-canvas/95 backdrop-blur-xl md:hidden">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Shield className="w-4 h-4 text-primary-on" />
                </div>
                <span className="text-base font-medium text-ink">SIFIX</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6 text-ink" />
              </button>
            </div>
            <div className="flex flex-col space-y-6">
              <a href="#features" className="text-lg font-medium text-ink py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="text-lg font-medium text-ink py-2" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="https://github.com/sifix-ai" className="text-lg font-medium text-ink py-2" onClick={() => setMobileMenuOpen(false)}>GitHub</a>
            </div>
          </div>
        )}

        {/* Hero Content - Resend Style with Playfair Display-inspired typography */}
        <div className="container mx-auto px-8 pt-40 pb-32 min-h-screen flex items-center">
          <div className="max-w-5xl mx-auto w-full">
            {/* Badge pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-hairline-strong rounded-full mb-12"
            >
              <div className="w-2 h-2 bg-accent-green rounded-full" />
              <span className="text-xs font-medium text-body tracking-wide">
                AI-POWERED SECURITY ON 0G CHAIN
              </span>
            </motion.div>

            {/* Display headline - Playfair Display at 96px */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-[72px] md:text-[96px] leading-[1.0] tracking-[-0.96px] text-ink mb-8 font-normal"
              style={{ maxWidth: '900px' }}
            >
              Wallet security
              <br />
              for developers
            </motion.h1>

            {/* Subtitle - Inter body */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg leading-relaxed text-body max-w-2xl mb-12"
            >
              AI-powered transaction analysis that intercepts, analyzes, and blocks malicious transactions before they drain your wallet. Built on 0G Chain with GPT-4.
            </motion.p>

            {/* CTA Buttons - Resend Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              {isConnected ? (
                <Link href="/dashboard">
                  <button className="btn-primary flex items-center gap-2 h-9 px-4">
                    Launch Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              ) : (
                <ConnectButton />
              )}
              <a href="https://github.com/sifix-ai" target="_blank" rel="noopener noreferrer">
                <button className="btn-ghost flex items-center gap-2 h-9 px-4">
                  View on GitHub
                </button>
              </a>
            </motion.div>

            {/* Trust indicators - subtle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-16 flex flex-wrap items-center gap-6 text-xs text-charcoal"
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent-green rounded-full" />
                <span>Live on 0G Newton</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent-blue rounded-full" />
                <span>95%+ Detection Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent-orange rounded-full" />
                <span>Powered by GPT-4</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
