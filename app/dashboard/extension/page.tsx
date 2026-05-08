"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, Copy, Check, ExternalLink, ArrowLeft, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

declare global {
  interface Window {
    ethereum?: any
  }
}

type Step = "connect" | "signing" | "done"

export default function ExtensionSetupPage() {
  const [step, setStep] = useState<Step>("connect")
  const [walletAddress, setWalletAddress] = useState("")
  const [token, setToken] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  const handleConnect = async () => {
    setError("")

    if (!window.ethereum) {
      setError("MetaMask atau wallet Web3 tidak terdeteksi. Install dulu ya.")
      return
    }

    try {
      setStep("signing")

      // 1. Request accounts
      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (!accounts.length) {
        setError("Tidak ada wallet terdeteksi")
        setStep("connect")
        return
      }

      const address = accounts[0]
      setWalletAddress(address)

      // 2. Get nonce
      const nonceRes = await fetch(`/api/v1/auth/nonce?walletAddress=${address}`)
      const nonceData = await nonceRes.json()

      if (!nonceData.message) {
        throw new Error("Gagal mendapatkan nonce")
      }

      // 3. Sign message
      const signature: string = await window.ethereum.request({
        method: "personal_sign",
        params: [nonceData.message, address],
      })

      // 4. Verify and get token
      const verifyRes = await fetch("/api/v1/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          signature,
          message: nonceData.message,
        }),
      })

      const verifyData = await verifyRes.json()

      if (!verifyData.success || !verifyData.token) {
        throw new Error(verifyData.error || "Verifikasi gagal")
      }

      setToken(verifyData.token)
      setExpiresAt(verifyData.expiresAt)
      setStep("done")

      // Auto-send token to extension via postMessage
      // Content script (auth-bridge.ts) picks this up and saves to chrome.storage
      if (typeof window !== "undefined") {
        window.postMessage({
          type: "SIFIX_EXTENSION_TOKEN",
          token: verifyData.token,
          walletAddress: verifyData.walletAddress,
        }, "*")
        console.log("[SIFIX] Token sent to extension via postMessage")
      }
    } catch (err: any) {
      setError(err.message || "Koneksi gagal")
      setStep("connect")
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Dashboard
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#ff6b6b] to-[#4ecdc4] flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Extension Setup</h1>
          <p className="text-white/60 text-sm">
            Connect wallet untuk mendapatkan API token, lalu paste ke SIFIX Extension.
          </p>
        </div>

        {/* Step: Connect */}
        {step === "connect" && (
          <Card className="p-8 text-center">
            <div className="mb-6">
              <div className="text-4xl mb-3">🔗</div>
              <h3 className="text-lg font-semibold mb-2">Step 1: Connect Wallet</h3>
              <p className="text-white/50 text-sm">
                Sign message untuk verifikasi. Tidak ada gas fee.
              </p>
            </div>

            <Button
              onClick={handleConnect}
              className="bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] text-white hover:shadow-lg hover:shadow-[#ff6b6b]/20 px-8 py-6 text-base"
              size="lg"
            >
              Connect Wallet
            </Button>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">
                {error}
              </div>
            )}
          </Card>
        )}

        {/* Step: Signing */}
        {step === "signing" && (
          <Card className="p-8 text-center">
            <Loader2 className="w-10 h-10 text-[#4ecdc4] mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold mb-2">Signing...</h3>
            <p className="text-white/50 text-sm">
              Confirm signature di wallet kamu. Tidak ada gas fee.
            </p>
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">
                {error}
              </div>
            )}
          </Card>
        )}

        {/* Step: Done */}
        {step === "done" && (
          <div className="space-y-4">
            {/* Success */}
            <Card className="p-6 border-green-500/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-400">Token Generated!</h3>
                  <p className="text-white/50 text-xs">
                    Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                </div>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-[#4ecdc4]/10 border border-[#4ecdc4]/20">
                <p className="text-xs text-[#4ecdc4]">
                  ✅ Token otomatis dikirim ke SIFIX Extension! Buka popup extension sekarang.
                </p>
              </div>
            </Card>

            {/* Token Display */}
            <Card className="p-6">
              <h4 className="text-sm font-medium text-white/60 mb-3">
                API Token
              </h4>
              <div className="relative">
                <div className="bg-[#111] rounded-lg p-4 pr-24 font-mono text-xs break-all text-[#4ecdc4] border border-white/5">
                  {token}
                </div>
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 px-3 py-2 rounded-lg bg-[#4ecdc4]/20 hover:bg-[#4ecdc4]/30 transition-colors flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-xs text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#4ecdc4]" />
                      <span className="text-xs text-[#4ecdc4]">Copy</span>
                    </>
                  )}
                </button>
              </div>

              {expiresAt && (
                <p className="text-xs text-white/30 mt-2">
                  Valid until: {new Date(expiresAt).toLocaleDateString()}
                </p>
              )}
            </Card>

            {/* Instructions */}
            <Card className="p-6">
              <h4 className="text-sm font-medium text-white/80 mb-4">
                Cara pakai di Extension:
              </h4>
              <ol className="space-y-3 text-sm text-white/60">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#4ecdc4]/20 flex items-center justify-center text-[#4ecdc4] text-xs font-bold shrink-0">1</span>
                  <span>Buka SIFIX Extension di browser</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#4ecdc4]/20 flex items-center justify-center text-[#4ecdc4] text-xs font-bold shrink-0">2</span>
                  <span>Klik <strong className="text-white/80">&quot;Sudah punya token? Paste di sini&quot;</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#4ecdc4]/20 flex items-center justify-center text-[#4ecdc4] text-xs font-bold shrink-0">3</span>
                  <span>Paste token di atas, klik <strong className="text-white/80">Connect</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold shrink-0">✓</span>
                  <span>Extension siap digunakan!</span>
                </li>
              </ol>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleConnect}
                variant="outline"
                className="flex-1 border-white/10 hover:bg-white/5"
              >
                Regenerate Token
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] text-white">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
