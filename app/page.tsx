import Link from 'next/link';
import { Shield, Search, AlertTriangle, TrendingUp, ArrowRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#07080a]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#07080a]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#FF6363]" />
            <span className="font-semibold text-white">SIFIX</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/search" className="text-sm text-white/60 hover:text-white transition-colors">
              Search
            </Link>
            <Link href="/threats" className="text-sm text-white/60 hover:text-white transition-colors">
              Threats
            </Link>
            <Link href="/analytics" className="text-sm text-white/60 hover:text-white transition-colors">
              Analytics
            </Link>
            <a 
              href="https://github.com/sifix-ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </nav>

          <Link href="/search">
            <Button variant="default" size="sm">
              Launch App
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF6363]/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-full text-sm text-white/80 mb-6">
              <span className="w-2 h-2 bg-[#FF6363] rounded-full animate-pulse" />
              Built for 0G APAC Hackathon 2026
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-semibold text-white mb-6 tracking-tight">
              AI-Powered Wallet
              <br />
              <span className="text-[#FF6363]">Security Agent</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed">
              Autonomous AI that intercepts transactions, simulates risks, and reports threats to on-chain reputation system. Protect your wallet before you sign.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/search">
                <Button size="lg" className="w-full sm:w-auto">
                  Check Address Reputation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a 
                href="https://github.com/sifix-ai/sifix-extension" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Install Extension
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-white/60">AI Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">&lt;100ms</div>
                <div className="text-sm text-white/60">Analysis Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">0G Chain</div>
                <div className="text-sm text-white/60">On-Chain Data</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-white/[0.08]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-semibold text-white text-center mb-16">
              How SIFIX Protects You
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-xl hover:border-[#FF6363]/30 transition-colors">
                <div className="w-12 h-12 bg-[#FF6363]/10 border border-[#FF6363]/20 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-[#FF6363]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Transaction Interception
                </h3>
                <p className="text-white/60 leading-relaxed">
                  Browser extension intercepts every transaction before you sign. No malicious TX gets through.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-xl hover:border-[#55b3ff]/30 transition-colors">
                <div className="w-12 h-12 bg-[#55b3ff]/10 border border-[#55b3ff]/20 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-[#55b3ff]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  AI Risk Analysis
                </h3>
                <p className="text-white/60 leading-relaxed">
                  GPT-4 powered agent simulates transactions and analyzes risks in real-time with 95%+ accuracy.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-xl hover:border-[#5fc992]/30 transition-colors">
                <div className="w-12 h-12 bg-[#5fc992]/10 border border-[#5fc992]/20 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-[#5fc992]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  On-Chain Reputation
                </h3>
                <p className="text-white/60 leading-relaxed">
                  Threat reports stored on 0G Chain. Build decentralized reputation system for addresses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-white/[0.08]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Ready to Secure Your Wallet?
            </h2>
            <p className="text-lg text-white/60 mb-8">
              Join the future of wallet security with AI-powered protection
            </p>
            <Link href="/search">
              <Button size="lg">
                Get Started Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#FF6363]" />
              <span className="text-sm text-white/60">
                © 2026 SIFIX. Built by Team Butuh Uwang.
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a 
                href="https://github.com/sifix-ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a 
                href="https://chainscan-newton.0g.ai/address/0x544a39149d5169E4e1bDf7F8492804224CB70152" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Contract
              </a>
              <Link href="/analytics" className="text-sm text-white/60 hover:text-white transition-colors">
                Analytics
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
