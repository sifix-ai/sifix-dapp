'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Marquee } from '@/components/ui/marquee'

const partners = [
  {
    name: '0G Chain',
    logo: '/0g-brandkit/0G-Logo-Purple_Hero.svg',
    width: 100,
    height: 48,
  },
  {
    name: 'Ethereum',
    logo: 'https://cdn.simpleicons.org/ethereum/white',
    width: 48,
    height: 48,
  },
  {
    name: 'Solidity',
    logo: 'https://cdn.simpleicons.org/solidity/white',
    width: 48,
    height: 48,
  },
  {
    name: 'OpenZeppelin',
    logo: 'https://cdn.simpleicons.org/openzeppelin/white',
    width: 48,
    height: 48,
  },
]

export function PartnersSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-blue/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-md border border-white/15 mb-6">
            <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
            <span className="text-sm text-white/60">Built on 0G Chain Infrastructure</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Powered by 0G Chain
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            SIFIX leverages 0G Chain's cutting-edge infrastructure including 0G Compute, 
            0G Storage, and Agentic ID to deliver unparalleled Web3 security
          </p>
        </motion.div>

        {/* Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <Marquee pauseOnHover className="[--duration:40s]">
            {partners.map((partner, idx) => (
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
        </motion.div>

        {/* Stats */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {[
            { label: 'Blockchain Networks', value: '1+' },
            { label: 'AI Providers', value: '4+' },
            { label: 'Tech Integrations', value: '8+' },
            { label: 'Uptime', value: '99.9%' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-4 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/15"
            >
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </motion.div> */}
      </div>
    </section>
  )
}
