"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Activity, Shield, Users, Trophy } from "lucide-react"

function Counter({ end, duration = 2 }: { end: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let startTime: number
      const numericValue = parseInt(end.replace(/[^\d]/g, ""))

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)

        setCount(Math.floor(progress * numericValue))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [isInView, end, duration])

  return (
    <span ref={ref}>
      {count}
      {end.replace(/[\d]/g, "")}
    </span>
  )
}

export function StatsSection() {
  const stats = [
    {
      value: "50K+",
      label: "Transactions Analyzed",
      icon: Activity,
    },
    {
      value: "1.2K+",
      label: "Threats Blocked",
      icon: Shield,
    },
    {
      value: "10K+",
      label: "Protected Wallets",
      icon: Users,
    },
    {
      value: "99.9%",
      label: "Detection Accuracy",
      icon: Trophy,
    },
  ]

  return (
    <section className="py-32 relative bg-canvas">
      {/* Atmospheric glow - green accent - subtle */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[1000px] h-[1000px] bg-accent-green-glow rounded-full blur-3xl opacity-15" />
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header - Resend Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="font-display text-[76.8px] leading-[1.0] tracking-[-0.768px] text-ink mb-6 font-normal">
              Trusted by thousands
            </h2>
            <p className="text-lg text-body max-w-2xl">
              Join the community of Web3 users who trust SIFIX to protect their assets
            </p>
          </motion.div>

          {/* Stats Grid - Feature Card Style */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="feature-card"
              >
                <div className="flex flex-col items-start">
                  <stat.icon className="w-6 h-6 text-ink mb-6" strokeWidth={1.5} />
                  
                  <div className="text-[56px] leading-[1.2] tracking-[-2.8px] font-normal text-ink mb-2">
                    <Counter end={stat.value} />
                  </div>

                  <div className="text-sm text-charcoal font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
