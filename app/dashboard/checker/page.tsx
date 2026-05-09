"use client"

import { Suspense, useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { useAccount } from "wagmi"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  Search, Shield, AlertTriangle, ArrowRight,
  ThumbsUp, ThumbsDown, Loader2, Flag, CheckCircle2,
} from "lucide-react"

type ScanState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; data: any }

function CheckerContent() {
  const searchParams = useSearchParams()
  const { address: walletAddress } = useAccount()
  const [query, setQuery] = useState(searchParams.get("q") ?? "")
  const [state, setState] = useState<ScanState>({ status: "idle" })
  const didAutoRun = useRef(false)

  const runCheck = useCallback(async (input: string) => {
    if (!input.trim()) return
    setState({ status: "loading" })
    try {
      const url = new URL(`/api/v1/scan/${encodeURIComponent(input.trim())}`, window.location.origin)
      if (walletAddress) url.searchParams.set("checker", walletAddress)
      const res = await fetch(url.toString())
      const json = await res.json()
      if (json.success || json.data) {
        setState({ status: "done", data: json.data || json })
      } else {
        setState({ status: "error", message: json.error?.message ?? "Scan failed" })
      }
    } catch {
      setState({ status: "error", message: "Network error. Please try again." })
    }
  }, [walletAddress])

  useEffect(() => {
    const q = searchParams.get("q")
    if (q && !didAutoRun.current) {
      didAutoRun.current = true
      runCheck(q)
    }
  }, [searchParams, runCheck])

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault()
    runCheck(query)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Address & Domain Checker</h1>
        <p className="mt-1 text-sm text-white/50">Enter a wallet address, contract, or domain to get a trust score</p>
      </div>

      <Card>
        <form onSubmit={handleCheck} className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="0x... address, ENS name, or domain"
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={state.status === "loading"}>
            {state.status === "loading" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>Check <ArrowRight size={16} className="ml-2" /></>
            )}
          </Button>
        </form>
      </Card>

      {state.status === "error" && (
        <Card><p className="text-sm text-red-400">{state.message}</p></Card>
      )}

      {state.status === "done" && (
        <div className="space-y-4">
          {/* Score header */}
          <Card>
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                {state.data.displayInput && <p className="text-sm font-medium text-white/80">{state.data.displayInput}</p>}
                <p className="font-mono text-sm text-white/40">{state.data.resolvedAddress ?? state.data.address ?? state.data.domain}</p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="text-5xl font-bold text-accent-blue">{100 - (state.data.riskScore ?? 0)}</div>
                  <div>
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
                      (state.data.riskScore ?? 0) < 40 ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                      (state.data.riskScore ?? 0) < 70 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      "bg-red-500/10 text-red-400 border border-red-500/20"
                    )}>
                      <Shield size={12} />
                      {(state.data.riskLevel ?? "SAFE")}
                    </div>
                    <p className="mt-1 text-xs text-white/30">Trust Score out of 100</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {state.data.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
                    <CheckCircle2 size={10} /> Verified
                  </span>
                )}
                {state.data.inputType === "domain" && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-white/50 border border-white/10">Domain</span>
                )}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-xs text-white/30">Risk Score</p>
                <p className="mt-1 text-sm font-medium text-white">{state.data.riskScore ?? 0}/100</p>
              </div>
              <div>
                <p className="text-xs text-white/30">Reports</p>
                <p className="mt-1 text-sm font-medium text-white">{state.data.reportCount ?? 0}</p>
              </div>
              <div>
                <p className="text-xs text-white/30">Tags</p>
                <p className="mt-1 text-sm font-medium text-white">{state.data.tags?.length ?? 0}</p>
              </div>
            </div>
          </Card>

          {/* Tags */}
          {state.data.tags?.length > 0 && (
            <Card>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/40">Community Tags</h3>
              <div className="flex flex-wrap gap-2">
                {state.data.tags.map((t: any) => (
                  <span key={t.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/70 border border-white/10">
                    {t.tag}
                    {t.score !== undefined && <span className="text-white/30">({t.score > 0 ? `+${t.score}` : t.score})</span>}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Community Voting */}
          {(state.data.address || state.data.resolvedAddress) && (
            <Card>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/40">Community</h3>
              <p className="mb-4 text-sm text-white/40">Help the community by reporting suspicious activity.</p>
              <div className="flex items-center gap-3">
                <ReportScamButton address={state.data.resolvedAddress ?? state.data.address} />
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

function ReportScamButton({ address }: { address: string }) {
  const { address: walletAddress } = useAccount()
  const [loading, setLoading] = useState(false)
  const [reported, setReported] = useState(false)

  const handleReport = async () => {
    if (!walletAddress) return
    setLoading(true)
    try {
      const res = await fetch("/api/v1/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: address,
          reporterAddress: walletAddress,
          threatType: "SUSPICIOUS",
          severity: 50,
          explanation: "User-reported via checker page",
        }),
      })
      if (res.ok) setReported(true)
    } catch {}
    setLoading(false)
  }

  if (reported) {
    return (
      <span className="flex items-center gap-2 text-sm text-green-400">
        <CheckCircle2 size={14} /> Report submitted
      </span>
    )
  }

  return (
    <button
      onClick={handleReport}
      disabled={loading || !walletAddress}
      className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10 disabled:opacity-50"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Flag size={14} />}
      Report Scam
    </button>
  )
}

export default function CheckerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white/30">Loading...</div>}>
      <CheckerContent />
    </Suspense>
  )
}
