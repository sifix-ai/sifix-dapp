"use client"

import { Suspense, useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { useAccount } from "wagmi"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ReportScamModal } from "@/components/dashboard/report-scam-modal"
import {
  Search, Shield, ArrowRight,
  Loader2, Flag, CheckCircle2,
  Users, Clock,
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

  /* ── Reported By data ── */
  const [reports, setReports] = useState<any[]>([])
  const [reportsLoading, setReportsLoading] = useState(false)
  const [reportsTotal, setReportsTotal] = useState(0)

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

  const fetchReports = useCallback(async (addr: string) => {
    setReportsLoading(true)
    try {
      const url = new URL("/api/v1/threats", window.location.origin)
      url.searchParams.set("address", addr)
      url.searchParams.set("limit", "5")
      const res = await fetch(url.toString())
      const json = await res.json()
      if (json.data?.reports) {
        setReports(json.data.reports)
        setReportsTotal(json.data.total ?? json.data.reports.length)
      } else {
        setReports([])
        setReportsTotal(0)
      }
    } catch {
      setReports([])
      setReportsTotal(0)
    } finally {
      setReportsLoading(false)
    }
  }, [])

  const truncateAddress = (addr?: string) => {
    if (!addr) return "Unknown"
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatTimeAgo = (dateLike?: string) => {
    if (!dateLike) return "Unknown"
    const date = new Date(dateLike)
    const sec = Math.floor((Date.now() - date.getTime()) / 1000)
    if (sec < 60) return `${sec}s ago`
    const min = Math.floor(sec / 60)
    if (min < 60) return `${min}m ago`
    const hr = Math.floor(min / 60)
    if (hr < 24) return `${hr}h ago`
    const day = Math.floor(hr / 24)
    return `${day}d ago`
  }

  const severityClass = (severity?: number) => {
    if ((severity ?? 0) >= 80) return "bg-red-500/10 text-red-400 border-red-500/20"
    if ((severity ?? 0) >= 60) return "bg-amber-500/10 text-amber-400 border-amber-500/20"
    if ((severity ?? 0) >= 40) return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    return "bg-green-500/10 text-green-400 border-green-500/20"
  }

  const statusClass = (status?: string) => {
    if (status === "VERIFIED") return "bg-accent-blue/10 text-accent-blue border-accent-blue/20"
    if (status === "REJECTED") return "bg-red-500/10 text-red-400 border-red-500/20"
    return "bg-white/5 text-white/60 border-white/10"
  }

  useEffect(() => {
    const q = searchParams.get("q")
    if (q && !didAutoRun.current) {
      didAutoRun.current = true
      runCheck(q)
    }
  }, [searchParams, runCheck])

  // Fetch reports when scan completes
  useEffect(() => {
    if (state.status === "done") {
      const addr = state.data.resolvedAddress ?? state.data.address
      if (addr) fetchReports(addr)
      else {
        setReports([])
        setReportsTotal(0)
      }
    }
  }, [state, fetchReports])

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault()
    setReports([])
    setReportsTotal(0)
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

          {/* ── Reported By ── */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">
                <Users size={14} className="inline mr-1.5 -mt-0.5" />
                Reported By
              </h3>
              {!reportsLoading && reportsTotal > 0 && (
                <span className="text-xs text-white/30">{reportsTotal} report{reportsTotal !== 1 ? "s" : ""} total</span>
              )}
            </div>

            {reportsLoading && (
              <div className="flex items-center gap-2 py-4 text-sm text-white/40">
                <Loader2 size={14} className="animate-spin" />
                Loading reports...
              </div>
            )}

            {!reportsLoading && reports.length === 0 && (
              <p className="py-4 text-sm text-white/30">No reports yet</p>
            )}

            {!reportsLoading && reports.length > 0 && (
              <div className="space-y-3">
                {reports.map((r: any) => (
                  <div
                    key={r.id}
                    className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* Left: reporter + threat info */}
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-white/80">{truncateAddress(r.reporterAddress)}</span>
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                          severityClass(r.severity)
                        )}>
                          {r.threatType}
                        </span>
                      </div>
                      {r.explanation && (
                        <p className="text-xs text-white/30 truncate max-w-md">{r.explanation}</p>
                      )}
                    </div>

                    {/* Right: status + time */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                        statusClass(r.status)
                      )}>
                        {r.status}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-white/30">
                        <Clock size={10} />
                        {formatTimeAgo(r.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Community Voting */}
          {(state.data.address || state.data.resolvedAddress) && (
            <Card>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/40">Community</h3>
              <p className="mb-4 text-sm text-white/40">Help the community by reporting suspicious activity.</p>
              <div className="flex items-center gap-3">
                <ReportScamAction
                  address={state.data.resolvedAddress ?? state.data.address}
                  isDomain={state.data.inputType === "domain"}
                />
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

function ReportScamAction({ address, isDomain }: { address: string; isDomain?: boolean }) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10"
      >
        <Flag size={14} />
        Report Scam
      </button>
      <ReportScamModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        targetAddress={address}
        isDomain={isDomain}
      />
    </>
  )
}

export default function CheckerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white/30">Loading...</div>}>
      <CheckerContent />
    </Suspense>
  )
}
