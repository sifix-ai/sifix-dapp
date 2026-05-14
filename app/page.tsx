"use client"

import { Shield } from "lucide-react"
import dynamic from "next/dynamic"
import { Hero2 } from '@/components/ui/hero-2'
import { GlassmorphicNavbar } from '@/components/ui/glassmorphic-navbar'
import { ProblemSection } from '@/components/blocks/problem-section'
import { SolutionSection } from '@/components/blocks/solution-section'
import { PipelineSection } from '@/components/blocks/pipeline-flowchart'
import { WhySifixSection } from '@/components/blocks/why-sifix'
import { ExtensionSection } from '@/components/blocks/extension-section'
import { BackgroundPaths } from "@/components/ui/background-paths"

// Dynamic import to avoid SSR hydration issues with motion hooks
const FeaturesGrid = dynamic(
  () => import('@/components/blocks/features-grid'),
  { ssr: false }
)

export default function Home() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Glassmorphic Navigation - Global */}
      <GlassmorphicNavbar />
      
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

      {/* Extension AI Agent Section */}
      <ExtensionSection />

      {/* Why Choose SIFIX Section */}
      <WhySifixSection />

      {/* CTA Section with Background Paths */}
      <BackgroundPaths title="Ready to Secure Your Wallet?" />

      {/* Footer - Resend Style */}
      <footer className="border-t border-hairline py-16 bg-canvas">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
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
            
            <div className="flex flex-col items-start justify-between gap-4 border-t border-divider-soft pt-8 text-left sm:flex-row sm:items-center">
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
