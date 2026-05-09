"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@/components/connect-button";
import { useAccount } from "wagmi";
import { motion, useInView } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Marquee } from "@/components/ui/marquee";

export function Hero2() {
  const { isConnected } = useAccount();

  return (
    <AuroraBackground>
      <div className="relative z-10 w-full h-full">
        {/* Hero Content - Resend Style with Playfair Display-inspired typography */}
        <div className="container mx-auto px-8 pt-40 pb-32 min-h-screen flex items-center">
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="max-w-5xl mx-auto w-full"
          >
            {/* Badge pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/15 rounded-full mb-12 backdrop-blur-md"
            >
              <div className="w-2 h-2 bg-accent-green rounded-full shadow-[0_0_8px_rgba(17,255,153,0.6)]" />
              <span className="text-xs font-medium text-white tracking-wide">
                AI-POWERED SECURITY ON 0G CHAIN
              </span>
            </motion.div>

            {/* Display headline - Playfair Display */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl lg:text-[64px] leading-[1.1] tracking-tight text-ink mb-8 font-normal"
              style={{ maxWidth: '900px' }}
            >
              Wallet security
              <br />
              for everyone
            </motion.h1>

            {/* Subtitle - Inter body */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg leading-relaxed text-body max-w-2xl mb-12"
            >
              AI-powered transaction analysis with verifiable Agentic ID that intercepts, analyzes, and blocks malicious transactions before they drain your wallet. Powered by 0G Compute with BYOAI flexibility.
            </motion.p>

            {/* CTA Buttons - Resend Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link href="/dashboard">
                <button className="group h-10 rounded-xl border border-white/15 bg-white/[0.04] px-4 text-sm font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-white/30 hover:bg-white/[0.08] flex items-center gap-2">
                  Launch Dashboard
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </button>
              </Link>
              <a href="https://github.com/sifix-ai" target="_blank" rel="noopener noreferrer">
                <button className="group h-10 rounded-xl border border-white/15 bg-white/[0.04] px-4 text-sm font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-white/30 hover:bg-white/[0.08] flex items-center gap-2">
                  View on GitHub
                </button>
              </a>
            </motion.div>

            {/* Trust indicators - subtle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-charcoal"
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent-green rounded-full shadow-[0_0_6px_rgba(17,255,153,0.5)]" />
                <span>Live on 0G Galileo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent-blue rounded-full shadow-[0_0_6px_rgba(59,158,255,0.5)]" />
                <span>Verifiable Agentic ID</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent-orange rounded-full shadow-[0_0_6px_rgba(255,128,31,0.5)]" />
                <span>0G Compute Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent-yellow rounded-full shadow-[0_0_6px_rgba(255,197,61,0.5)]" />
                <span>0G Storage Enabled</span>
              </div>
            </motion.div>

            {/* Partner Logos - Marquee */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-24"
            >
              <div className="text-center mb-8">
                <span className="text-xs text-white/40 uppercase tracking-wider">Powered by</span>
              </div>
              <div className="relative">
                <Marquee pauseOnHover className="[--duration:30s]">
                  {[
                    { name: '0G Chain', logo: '/0g-brandkit/0G-Logo-Purple_Hero.svg', width: 100, height: 48 },
                    { name: 'Ethereum', logo: 'https://cdn.simpleicons.org/ethereum/white', width: 48, height: 48 },
                    { name: 'Solidity', logo: 'https://cdn.simpleicons.org/solidity/white', width: 48, height: 48 },
                    { name: 'OpenZeppelin', logo: 'https://cdn.simpleicons.org/openzeppelin/white', width: 48, height: 48 },
                  ].map((partner, idx) => (
                    <div
                      key={idx}
                      className="mx-8 flex items-center justify-center group"
                    >
                      <div className="relative flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          width={partner.width}
                          height={partner.height}
                          className="object-contain filter brightness-0 invert"
                          unoptimized={partner.logo.startsWith('http')}
                        />
                      </div>
                    </div>
                  ))}
                </Marquee>
                {/* Gradient overlays */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-canvas to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-canvas to-transparent" />
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Gradient blend to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent via-canvas/50 to-canvas pointer-events-none z-20" />
      </div>
    </AuroraBackground>
  );
  
}
