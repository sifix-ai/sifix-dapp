"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Store,
  Radio,
  Shield,
  Zap,
  Globe,
  Lock,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Building2,
  Sparkles,
} from "lucide-react"

const tiers = [
  {
    name: "Basic",
    price: "Free",
    period: "",
    limit: "100 calls / day",
    description: "Get started with address risk lookups at no cost.",
    features: [
      "Address risk lookup",
      "Risk score + level",
      "Basic threat tags",
      "REST API access",
    ],
    highlight: false,
    cta: "Apply — Free",
    tierKey: "BASIC" as const,
  },
  {
    name: "Pro",
    price: "$499",
    period: "/ mo",
    limit: "10,000 calls / day",
    description: "Real-time feeds and webhooks for active DeFi protocols.",
    features: [
      "Everything in Basic",
      "Real-time threat feed",
      "Webhook alerts",
      "Batch address scanning",
      "Priority support",
      "Usage analytics dashboard",
    ],
    highlight: true,
    cta: "Apply for Pro",
    tierKey: "PRO" as const,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    limit: "Unlimited",
    description: "White-label integration with SLA and dedicated support.",
    features: [
      "Everything in Pro",
      "SLA guarantee",
      "White-label integration",
      "Dedicated support engineer",
      "Custom data feeds",
      "On-chain blacklist sync",
      "Insurance risk scoring",
    ],
    highlight: false,
    cta: "Contact Sales",
    tierKey: "ENTERPRISE" as const,
  },
]

const useCaseOptions = [
  { value: "DEX_INTEGRATION", label: "DEX Integration" },
  { value: "LENDING_PROTOCOL", label: "Lending Protocol" },
  { value: "WALLET", label: "Wallet / Frontend" },
  { value: "INSURANCE", label: "Insurance Protocol" },
  { value: "BRIDGE", label: "Cross-chain Bridge" },
  { value: "OTHER", label: "Other" },
]

type TierKey = "BASIC" | "PRO" | "ENTERPRISE"

interface FormState {
  protocolName: string
  website: string
  contactEmail: string
  useCase: string
  requestedTier: TierKey
}

export default function MarketplacePage() {
  const [selectedTier, setSelectedTier] = useState<TierKey>("PRO")
  const [form, setForm] = useState<FormState>({
    protocolName: "",
    website: "",
    contactEmail: "",
    useCase: "",
    requestedTier: "PRO",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTierSelect = (tier: TierKey) => {
    setSelectedTier(tier)
    setForm((f) => ({ ...f, requestedTier: tier }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch("/api/v1/marketplace/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, requestedTier: selectedTier }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message ?? "Failed to submit application")
      }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Store className="w-6 h-6 text-accent-blue" />
            Threat Intelligence Marketplace
          </h2>
          <Badge className="bg-accent-blue/10 text-accent-blue border-accent-blue/20 text-xs">
            Preview
          </Badge>
        </div>
        <p className="text-white/60">
          Integrate SIFIX threat data into your protocol. Choose a tier and apply below.
        </p>
        <p className="mt-2 text-sm text-white/40">
          Integration flow in progress. Form and pricing shown as early preview.
        </p>
      </div>

      {/* Tier Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {tiers.map((tier) => (
          <button
            key={tier.name}
            onClick={() => handleTierSelect(tier.tierKey)}
            className={`relative text-left rounded-2xl p-5 border transition-all duration-200 focus:outline-none ${
              selectedTier === tier.tierKey
                ? tier.highlight
                  ? "bg-accent-blue/[0.08] border-accent-blue/40 shadow-lg shadow-accent-blue/10"
                  : "bg-white/[0.07] border-white/30"
                : tier.highlight
                ? "bg-accent-blue/[0.04] border-accent-blue/15 hover:border-accent-blue/30"
                : "bg-white/[0.03] border-white/[0.08] hover:border-white/20"
            }`}
          >
            {tier.highlight && (
              <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 bg-accent-blue text-black text-xs font-bold rounded-full">
                POPULAR
              </span>
            )}
            {selectedTier === tier.tierKey && (
              <div className="absolute top-3 right-3">
                <CheckCircle2 className="w-4 h-4 text-accent-blue" />
              </div>
            )}
            <div className="mb-3">
              <p className="font-semibold text-white text-base">{tier.name}</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className={`text-2xl font-bold ${tier.highlight ? "text-accent-blue" : "text-white"}`}>
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-white/40 text-sm">{tier.period}</span>
                )}
              </div>
              <p className="text-xs text-white/40 mt-0.5">{tier.limit}</p>
            </div>
            <p className="text-xs text-white/50 mb-4">{tier.description}</p>
            <ul className="space-y-2">
              {tier.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent-blue flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      {/* What you get */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Radio, label: "Real-time Feed", desc: "Live threat data stream" },
          { icon: Shield, label: "Blacklist Sync", desc: "On-chain integration" },
          { icon: Globe, label: "White-label", desc: '"Secured by SIFIX" badge' },
          { icon: Lock, label: "Risk Scoring", desc: "Insurance-grade data" },
        ].map((item) => (
          <Card
            key={item.label}
            className="bg-white/[0.03] border-white/[0.08] flex items-center gap-3 p-4"
          >
            <div className="w-8 h-8 bg-accent-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <item.icon className="w-4 h-4 text-accent-blue" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{item.label}</p>
              <p className="text-xs text-white/40">{item.desc}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Application Form */}
      <Card className="bg-white/[0.04] border-white/10 backdrop-blur-md p-6 lg:p-8">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
            <div className="w-16 h-16 bg-accent-blue/15 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-accent-blue" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Application Received</h3>
              <p className="text-white/60 max-w-sm">
                We&apos;ll review your application and reach out to{" "}
                <span className="text-white">{form.contactEmail}</span> within 48 hours.
              </p>
            </div>
            <div className="px-4 py-2 bg-white/[0.05] border border-white/10 rounded-xl">
              <p className="text-xs text-white/40">
                Selected tier:{" "}
                <span className="text-accent-blue font-medium">{selectedTier}</span>
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-accent-blue/10 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-accent-blue" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Apply for Integration</h3>
                <p className="text-sm text-white/50">
                  Tell us about your protocol. Applying for{" "}
                  <span className="text-accent-blue font-medium">{selectedTier}</span> tier
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1.5" htmlFor="protocolName">
                    Protocol Name <span className="text-accent-red">*</span>
                  </label>
                  <input
                    id="protocolName"
                    type="text"
                    required
                    placeholder="e.g. Uniswap, Aave"
                    value={form.protocolName}
                    onChange={(e) => setForm((f) => ({ ...f, protocolName: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent-blue/40 focus:bg-white/[0.08] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1.5" htmlFor="website">
                    Protocol Website <span className="text-accent-red">*</span>
                  </label>
                  <input
                    id="website"
                    type="url"
                    required
                    placeholder="https://yourprotocol.com"
                    value={form.website}
                    onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent-blue/40 focus:bg-white/[0.08] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1.5" htmlFor="contactEmail">
                  Contact Email <span className="text-accent-red">*</span>
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  required
                  placeholder="team@yourprotocol.com"
                  value={form.contactEmail}
                  onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent-blue/40 focus:bg-white/[0.08] transition-colors"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1.5" htmlFor="useCase">
                    Use Case <span className="text-accent-red">*</span>
                  </label>
                  <select
                    id="useCase"
                    required
                    value={form.useCase}
                    onChange={(e) => setForm((f) => ({ ...f, useCase: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-accent-blue/40 focus:bg-white/[0.08] transition-colors appearance-none"
                  >
                    <option value="" disabled className="bg-[#0a0a0c] text-white/50">
                      Select use case…
                    </option>
                    {useCaseOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#0a0a0c] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1.5" htmlFor="requestedTier">
                    Requested Tier
                  </label>
                  <select
                    id="requestedTier"
                    value={selectedTier}
                    onChange={(e) => handleTierSelect(e.target.value as TierKey)}
                    className="w-full px-3 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-accent-blue/40 focus:bg-white/[0.08] transition-colors appearance-none"
                  >
                    <option value="BASIC" className="bg-[#0a0a0c] text-white">Basic — Free</option>
                    <option value="PRO" className="bg-[#0a0a0c] text-white">Pro — $499/mo</option>
                    <option value="ENTERPRISE" className="bg-[#0a0a0c] text-white">Enterprise — Custom</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 bg-accent-red/10 border border-accent-red/20 rounded-xl">
                  <p className="text-sm text-accent-red">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-white/30">
                  We respond within 48 hours.
                </p>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-accent-blue text-black font-semibold hover:opacity-90 px-6 gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </Card>

      {/* Revenue note */}
      <Card className="bg-white/[0.03] border-white/[0.08] p-4 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-accent-yellow mt-0.5 flex-shrink-0" />
        <p className="text-xs text-white/50">
          Protocol integrations are priced based on TVL and call volume. Enterprise contracts start at{" "}
          <span className="text-white/70">$2,000 / mo</span> and scale to{" "}
          <span className="text-white/70">$50,000+ / mo</span> for top-tier protocols. Insurance risk
          scoring is billed per query. All plans include a 14-day pilot period.
        </p>
      </Card>
    </div>
  )
}
