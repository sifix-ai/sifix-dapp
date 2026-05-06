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
      const suffix = end.replace(/[\d]/g, "")

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
      color: "from-pink-500 to-rose-500",
      bgColor: "from-pink-500/10 to-rose-500/10",
      borderColor: "border-pink-500/20",
      delay: 0,
    },
    {
      value: "1.2K+",
      label: "Threats Blocked",
      icon: Shield,
      color: "from-red-500 to-orange-500",
      bgColor: "from-red-500/10 to-orange-500/10",
      borderColor: "border-red-500/20",
      delay: 0.1,
    },
    {
      value: "10K+",
      label: "Protected Wallets",
      icon: Users,
      color: "from-violet-500 to-purple-500",
      bgColor: "from-violet-500/10 to-purple-500/10",
      borderColor: "border-violet-500/20",
      delay: 0.2,
    },
    {
      value: "99.9%",
      label: "Detection Accuracy",
      icon: Trophy,
      color: "from-cyan-500 to-blue-500",
      bgColor: "from-cyan-500/10 to-blue-500/10",
      borderColor: "border-cyan-500/20",
      delay: 0.3,
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#0f0a1f] to-[#160a25]">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-violet-50 mb-4">
              Trusted by{" "}
              <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Thousands
              </span>
            </h2>
            <p className="text-base text-violet-300/60 max-w-xl mx-auto">
              Join the community of Web3 users who trust SIFIX
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: stat.delay }}
                whileHover={{ scale: 1.03 }}
                className="relative group"
              >
                <div
                  className={`relative bg-gradient-to-br ${stat.bgColor} ${stat.borderColor} border-2 rounded-xl p-5 backdrop-blur-sm text-center group-hover:border-violet-500/40 transition-all duration-300`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>

                  <div className="text-3xl font-bold text-violet-50 mb-2">
                    <Counter end={stat.value} />
                  </div>

                  <div className="text-xs text-violet-400/60 font-medium uppercase tracking-wide">
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
