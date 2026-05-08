"use client"

import { Shield } from "lucide-react"
import { Hero2 } from '@/components/ui/hero-2'
import { ProblemSection } from '@/components/blocks/problem-section'
import { SolutionSection } from '@/components/blocks/solution-section'
import { PipelineSection } from '@/components/blocks/pipeline-flowchart'
import FeaturesGrid from '@/components/blocks/features-grid'
import { WhySifixSection } from '@/components/blocks/why-sifix'
import { BackgroundPaths } from "@/components/ui/background-paths"

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero Section with Integrated Stats */}
      <Hero2 />

      {/* Problem Section */}
      <ProblemSection />

      {/* Solution Section */}
      <SolutionSection />

      {/* Pipeline Section with Animated Beam */}
      <PipelineSection />

      {/* Features Section - Unified Grid & Advanced */}
      <FeaturesGrid />

      {/* Why Choose SIFIX Section */}
      <WhySifixSection />

      {/* CTA Section with Background Paths */}
      <BackgroundPaths title="Ready to Secure Your Wallet?" />

      {/* Footer - Resend Style */}
      <footer className="border-t border-hairline py-16 bg-canvas">
        <div className="container mx-auto px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <h3 className="text-sm font-medium text-ink mb-4">Product</h3>
                <ul className="space-y-3">
                  <li><a href="#features" className="text-sm text-charcoal hover:text-ink transition-colors">Features</a></li>
                  <li><a href="#how-it-works" className="text-sm text-charcoal hover:text-ink transition-colors">How It Works</a></li>
                  <li><a href="/dashboard" className="text-sm text-charcoal hover:text-ink transition-colors">Dashboard</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-ink mb-4">Resources</h3>
                <ul className="space-y-3">
                  <li><a href="https://github.com/sifix-ai" target="_blank" rel="noopener noreferrer" className="text-sm text-charcoal hover:text-ink transition-colors">GitHub</a></li>
                  <li><a href="https://0g.ai" target="_blank" rel="noopener noreferrer" className="text-sm text-charcoal hover:text-ink transition-colors">0G Chain</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-ink mb-4">Contract</h3>
                <ul className="space-y-3">
                  <li><a href="https://chainscan-galileo.0g.ai/address/0x544a39149d5169E4e1bDf7F8492804224CB70152" target="_blank" rel="noopener noreferrer" className="text-sm text-charcoal hover:text-ink transition-colors">View on Explorer</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-ink mb-4">Status</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-green rounded-full" />
                  <span className="text-sm text-charcoal">Operational</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-divider-soft pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-ash" />
                <span className="text-sm text-ash">
                  © 2026 SIFIX. Built for 0G Chain APAC Hackathon.
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
