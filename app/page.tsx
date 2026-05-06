"use client"

import Link from "next/link"
import { Shield, AlertTriangle, Search as SearchIcon, TrendingUp, ArrowRight, ExternalLink, Sparkles, Zap, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useRef } from "react"

// Neural network animation component
function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const nodes: { x: number; y: number; vx: number; vy: number }[] = []
    const nodeCount = 50

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      
      ctx.fillStyle = 'rgba(7, 8, 10, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw nodes
      nodes.forEach((node, i) => {
        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Draw connections
        nodes.forEach((otherNode, j) => {
          if (i === j) return
          const dx = node.x - otherNode.x
          const dy = node.y - otherNode.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 99, 99, ${0.2 * (1 - distance / 150)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.stroke()
          }
        })

        // Draw node
        ctx.beginPath()
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = '#FF6363'
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />
}

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#07080a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.08] bg-[#07080a]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#FF6363]" />
            <span className="font-semibold text-white tracking-tight">SIFIX</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/search" className="text-sm text-white/60 hover:text-white transition-colors font-medium">
              Search
            </Link>
            <Link href="/threats" className="text-sm text-white/60 hover:text-white transition-colors font-medium">
              Threats
            </Link>
            <Link href="/analytics" className="text-sm text-white/60 hover:text-white transition-colors font-medium">
              Analytics
            </Link>
            <a 
              href="https://github.com/sifix-ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-white transition-colors font-medium"
            >
              GitHub
            </a>
          </nav>

          <Link href="/search">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50 bg-[#FF6363] text-white shadow hover:bg-[#FF6363]/90 h-9 rounded-lg px-4 text-sm">
              Launch App
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section with Neural Network */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Neural Network Background */}
        <div className="absolute inset-0">
          <NeuralNetwork />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6363]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#55b3ff]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-full text-sm text-white/80 mb-8">
              <Sparkles className="w-4 h-4 text-[#FF6363]" />
              <span className="uppercase tracking-wider text-xs font-semibold">AI-Powered Security</span>
              <span className="w-2 h-2 bg-[#FF6363] rounded-full animate-pulse" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
            >
              Protect Your
              <br />
              <span className="bg-gradient-to-r from-[#FF6363] via-[#FF6363]/80 to-[#55b3ff] bg-clip-text text-transparent">
                Web3 Wallet
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-white/60 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              AI agent that intercepts transactions, simulates risks in real-time, 
              and reports threats to on-chain reputation system before you sign.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link href="/search">
                <button className="group inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6363]/20 disabled:pointer-events-none disabled:opacity-50 bg-[#FF6363] text-white shadow-lg shadow-[#FF6363]/30 hover:shadow-xl hover:shadow-[#FF6363]/40 hover:scale-105 active:scale-95 h-14 rounded-full px-10 w-full sm:w-auto uppercase tracking-wider">
                  <Zap className="w-5 h-5" />
                  Check Address
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
              
              <a 
                href="https://github.com/sifix-ai/sifix-extension" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-base font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:pointer-events-none disabled:opacity-50 border-2 border-white/[0.12] bg-white/[0.03] text-white shadow-sm hover:bg-white/[0.08] hover:border-white/[0.16] h-14 rounded-full px-10 w-full sm:w-auto uppercase tracking-wider backdrop-blur-sm">
                  <Lock className="w-5 h-5" />
                  Install Extension
                  <ExternalLink className="w-4 h-4" />
                </button>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-8 max-w-3xl mx-auto p-8 bg-white/[0.02] border border-white/[0.08] rounded-2xl backdrop-blur-sm"
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2 tracking-tight">24/7</div>
                <div className="text-sm text-white/60 font-medium uppercase tracking-wider">AI Monitoring</div>
              </div>
              <div className="text-center border-x border-white/[0.08]">
                <div className="text-4xl font-bold text-white mb-2 tracking-tight">&lt;100ms</div>
                <div className="text-sm text-white/60 font-medium uppercase tracking-wider">Analysis Time</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2 tracking-tight">0G Chain</div>
                <div className="text-sm text-white/60 font-medium uppercase tracking-wider">On-Chain Data</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
                How SIFIX <span className="text-[#FF6363]">Protects</span> You
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Three-layer security system powered by AI and blockchain
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="group relative p-8 bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-white/[0.08] rounded-3xl hover:border-[#FF6363]/30 transition-all duration-500 hover:shadow-[0_20px_60px_-20px_rgba(255,99,99,0.4)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#FF6363]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-[#FF6363]/10 border border-[#FF6363]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <AlertTriangle className="w-8 h-8 text-[#FF6363]" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                    Transaction Interception
                  </h3>
                  
                  <p className="text-white/60 leading-relaxed">
                    Browser extension intercepts every transaction before you sign. 
                    Real-time analysis prevents malicious TX from executing.
                  </p>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group relative p-8 bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-white/[0.08] rounded-3xl hover:border-[#55b3ff]/30 transition-all duration-500 hover:shadow-[0_20px_60px_-20px_rgba(85,179,255,0.4)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#55b3ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-[#55b3ff]/10 border border-[#55b3ff]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <SearchIcon className="w-8 h-8 text-[#55b3ff]" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                    AI Risk Analysis
                  </h3>
                  
                  <p className="text-white/60 leading-relaxed">
                    GPT-4 powered agent simulates transactions and analyzes risks 
                    with 95%+ accuracy in under 100ms.
                  </p>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="group relative p-8 bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-white/[0.08] rounded-3xl hover:border-[#5fc992]/30 transition-all duration-500 hover:shadow-[0_20px_60px_-20px_rgba(95,201,146,0.4)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#5fc992]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-[#5fc992]/10 border border-[#5fc992]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <TrendingUp className="w-8 h-8 text-[#5fc992]" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                    On-Chain Reputation
                  </h3>
                  
                  <p className="text-white/60 leading-relaxed">
                    Threat reports stored on 0G Chain. Build decentralized 
                    reputation system for addresses.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-12 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
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
                className="text-sm text-white/60 hover:text-white transition-colors font-medium"
              >
                GitHub
              </a>
              <a 
                href="https://chainscan-newton.0g.ai/address/0x544a39149d5169E4e1bDf7F8492804224CB70152" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-white/60 hover:text-white transition-colors font-medium"
              >
                Contract
              </a>
              <Link 
                href="/analytics"
                className="text-sm text-white/60 hover:text-white transition-colors font-medium"
              >
                Analytics
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
