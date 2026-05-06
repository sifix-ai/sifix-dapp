"use client"

import { ArrowRight } from "lucide-react"
import { useState, Suspense, lazy } from "react"

const Dithering = lazy(() => 
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
)

export function CTASection() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="py-12 w-full flex justify-center items-center px-4 md:px-6">
      <div 
        className="w-full max-w-7xl relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-[48px] border border-white/[0.08] bg-[#0f1011] shadow-sm min-h-[600px] md:min-h-[600px] flex flex-col items-center justify-center duration-500">
          <Suspense fallback={<div className="absolute inset-0 bg-white/[0.02]" />}>
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-30 mix-blend-screen">
              <Dithering
                colorBack="#00000000"
                colorFront="#FF6363"
                shape="warp"
                type="4x4"
                speed={isHovered ? 0.6 : 0.2}
                className="size-full"
                minPixelRatio={1}
              />
            </div>
          </Suspense>

          <div className="relative z-10 px-6 max-w-4xl mx-auto text-center flex flex-col items-center">
            
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#FF6363]/10 bg-[#FF6363]/5 px-4 py-1.5 text-sm font-medium text-[#FF6363] backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6363] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6363]"></span>
              </span>
              AI-Powered Security
            </div>

            <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white mb-8 leading-[1.05]">
              Your wallet, <br />
              <span className="text-white/80">protected perfectly.</span>
            </h2>
            
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
              Join 2,847 Web3 users protected by the only AI that intercepts threats before you sign. 
              Clean, precise, and uniquely secure.
            </p>

            <button className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-[#FF6363] px-12 text-base font-medium text-white transition-all duration-300 hover:bg-[#FF6363]/90 hover:scale-105 active:scale-95 hover:ring-4 hover:ring-[#FF6363]/20">
              <span className="relative z-10">Start Protecting</span>
              <ArrowRight className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
