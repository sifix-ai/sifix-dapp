"use client";

import { useState, useEffect } from "react";
import { Menu, X, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@/components/connect-button";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";

export function GlassmorphicNavbar() {
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
    <>
      {/* Navigation - Glassmorphic and Sticky */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur shadow-[0_8px_32px_0_rgba(139,92,246,0.1)]"
            : "bg-transparent backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/sifix-white.png"
              alt="SIFIX Logo"
              width={100}
              height={100}
              className="rounded-lg transition-transform duration-300 group-hover:scale-110"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-charcoal hover:text-ink transition-colors duration-200 relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-charcoal hover:text-ink transition-colors duration-200 relative group"
            >
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
            </a>
            <a
              href="https://github.com/sifix-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-charcoal hover:text-ink transition-colors duration-200 relative group"
            >
              GitHub
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
            </a>
            <Link href="/dashboard">
              <button className="group h-10 rounded-xl border border-white/15 bg-white/[0.04] px-4 text-sm font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-white/30 hover:bg-white/[0.08] flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Launch Dashboard
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-surface-elevated transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-ink" />
            ) : (
              <Menu className="h-6 w-6 text-ink" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Navigation Menu - Glassmorphic */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto px-5 py-6 bg-canvas/95 backdrop-blur-2xl md:hidden safe-top safe-bottom"
        >
          <div className="flex items-center justify-between mb-12">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-glow-violet">
                <Shield className="w-4 h-4 text-primary-on" />
              </div>
              <span className="text-base font-semibold text-ink">SIFIX</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-surface-elevated transition-colors duration-200"
            >
              <X className="h-6 w-6 text-ink" />
            </button>
          </div>
          <div className="flex flex-col space-y-6">
            <a
              href="#features"
              className="text-lg font-medium text-ink py-2 hover:text-primary transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-lg font-medium text-ink py-2 hover:text-primary transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="https://github.com/sifix-ai"
              className="text-lg font-medium text-ink py-2 hover:text-primary transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              GitHub
            </a>
            <div className="pt-4 border-t border-hairline">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <button className="group h-10 rounded-xl border border-white/15 bg-white/[0.04] px-4 text-sm font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-white/30 hover:bg-white/[0.08] flex items-center gap-2 w-full justify-center">
                  <Shield className="w-4 h-4" />
                  Launch Dashboard
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
