"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Lock, Users } from "lucide-react"

export function WhySifixSection() {
  const features = [
    {
      icon: Shield,
      title: "AI-Powered Analysis",
      description: "Agentic ID with 0G Compute analyzes every transaction before execution",
      color: "text-accent-blue",
      bgColor: "bg-accent-blue/10",
    },
    {
      icon: Zap,
      title: "Real-time Protection",
      description: "Block threats instantly before they drain your wallet",
      color: "text-accent-yellow",
      bgColor: "bg-accent-yellow/10",
    },
    {
      icon: Lock,
      title: "Decentralized Storage",
      description: "Threat intelligence stored on 0G Storage for community safety",
      color: "text-accent-green",
      bgColor: "bg-accent-green/10",
    },
  ]

  return (
    <section className="py-32 relative bg-canvas overflow-hidden">
      {/* Atmospheric glow */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-primary-glow rounded-full blur-3xl opacity-10" />
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/15 rounded-full mb-8 backdrop-blur-md">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-white tracking-wide">WHY CHOOSE SIFIX</span>
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl lg:text-[64px] leading-[1.1] tracking-tight text-ink mb-6 font-normal">
              Why do 500+ users trust SIFIX?
            </h2>
            
            <p className="text-lg text-body max-w-2xl mx-auto">
              Everything you need to stay safe in Web3, powered by 0G Chain infrastructure
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Card */}
                <div className="relative bg-white/[0.04] border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300">
                  {/* Icon */}
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} strokeWidth={1.5} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-base font-semibold text-ink mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-charcoal">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            {/* Container with glassmorphic background */}
            <div className="relative bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm overflow-hidden">
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent-blue/5 pointer-events-none" />
              
              {/* Content */}
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                {/* Left side - Stats/Info */}
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-primary">Trusted by the community</span>
                  </div>
                  
                  <h3 className="font-display text-3xl md:text-4xl text-ink">
                    Built on 0G Chain
                  </h3>
                  
                  <p className="text-base text-body">
                    Leveraging 0G's cutting-edge infrastructure for compute, storage, and verifiable AI agents to provide unmatched security.
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-primary">500+</div>
                      <div className="text-xs text-charcoal mt-1">Protected Users</div>
                    </div>
                    <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4">
                      <div className="text-2xl font-bold text-accent-green">5K+</div>
                      <div className="text-xs text-charcoal mt-1">Threats Blocked</div>
                    </div>
                  </div>
                </div>

                {/* Right side - Visual element */}
                <div className="relative">
                  {/* Placeholder for visual - you can replace with actual image or illustration */}
                  <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-accent-blue/10 to-accent-green/20 border border-white/10 overflow-hidden">
                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                                       linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)`,
                      backgroundSize: '24px 24px'
                    }} />
                    
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 bg-primary/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-primary/30">
                        <Shield className="w-12 h-12 text-primary" strokeWidth={1.5} />
                      </div>
                    </div>
                    
                    {/* Floating elements */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-8 right-8 w-16 h-16 bg-accent-blue/20 rounded-xl backdrop-blur-sm border border-accent-blue/30 flex items-center justify-center"
                    >
                      <Zap className="w-8 h-8 text-accent-blue" strokeWidth={1.5} />
                    </motion.div>
                    
                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="absolute bottom-8 left-8 w-16 h-16 bg-accent-green/20 rounded-xl backdrop-blur-sm border border-accent-green/30 flex items-center justify-center"
                    >
                      <Lock className="w-8 h-8 text-accent-green" strokeWidth={1.5} />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
