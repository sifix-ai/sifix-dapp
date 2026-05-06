"use client"

import { Shield } from "lucide-react"
import { Hero2 } from '@/components/ui/hero-2'
import { BackgroundPaths } from "@/components/ui/background-paths"
import { StatsSection } from '@/components/blocks/stats-section'
import { ProblemSection } from '@/components/blocks/problem-section'
import { SolutionSection } from '@/components/blocks/solution-section'
import { PipelineSection } from '@/components/blocks/pipeline-flowchart'
import { FeaturesComplete } from '@/components/blocks/features-complete'
import { WhySifixSection } from '@/components/blocks/why-sifix'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0118] to-[#1a1625]">
      {/* Hero Section */}
      <Hero2 />

      {/* Stats Section */}
      <StatsSection />

      {/* Problem Section */}
      <ProblemSection />

      {/* Solution Section */}
      <SolutionSection />

      {/* Pipeline Section with Animated Beam */}
      <PipelineSection />

      {/* Features Section */}
      <FeaturesComplete />

      {/* Why Choose SIFIX Section */}
      <WhySifixSection />

      {/* CTA Section with Background Paths */}
      <BackgroundPaths title="Ready to Secure Your Wallet?" />

      {/* Footer */}
      <footer className="border-t border-violet-500/10 py-6 bg-[#0a0118]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-violet-400/60">
                  © 2026 SIFIX. Built for 0G Chain APAC Hackathon.
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <a
                  href="https://github.com/sifix-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400/60 hover:text-violet-100 transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://chainscan-newton.0g.ai/address/0x544a39149d5169E4e1bDf7F8492804224CB70152"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400/60 hover:text-violet-100 transition-colors"
                >
                  Contract
                </a>
                <a
                  href="https://0g.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400/60 hover:text-violet-100 transition-colors"
                >
                  0G Chain
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
