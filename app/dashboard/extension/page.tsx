"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, Copy, Check, ArrowLeft, Loader2, Key, CheckCircle2, ArrowRight, Download, Link2, FileSignature } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/store/app-store"
import { useAccount } from "wagmi"

declare global {
  interface Window {
    ethereum?: any
  }
}

const STEP_ORDER = ["install", "connect", "signing", "verify", "done"] as const

type Step = typeof STEP_ORDER[number]

export default function ExtensionSetupPage() {
  const { isConnected } = useAccount()
  const {
    extensionInstalled,
    extensionConnected,
    extensionSetupStep,
    setExtensionInstalled,
    setExtensionConnected,
    setExtensionSetupStep,
  } = useAppStore()

  const [walletAddress, setWalletAddress] = useState("")
  const [token, setToken] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  const step: Step = extensionSetupStep

  const markInstalled = () => {
    setExtensionInstalled(true)
    setExtensionSetupStep("connect")
  }

  const handleConnect = async () => {
    setError("")

    if (!window.ethereum) {
      setError("No Web3 wallet detected. Please install MetaMask or compatible wallet.")
      return
    }

    try {
      setExtensionSetupStep("signing")

      const accounts: string[] = await window.ethereum.request({ method: "eth_requestAccounts" })
      if (!accounts.length) {
        setError("No wallet account detected")
        setExtensionSetupStep("connect")
        return
      }

      const address = accounts[0]
      setWalletAddress(address)

      const { authenticateExtension } = await import("@/services/extension-auth-service")
      const verifyData = await authenticateExtension({
        walletAddress: address,
        signMessage: async (message: string, addr: string) => {
          return window.ethereum!.request({
            method: "personal_sign",
            params: [message, addr],
          })
        },
      })

      setToken(verifyData.token)
      setExpiresAt(verifyData.expiresAt)
      setExtensionSetupStep("verify")

      if (typeof window !== "undefined") {
        window.postMessage(
          {
            type: "SIFIX_EXTENSION_TOKEN",
            token: verifyData.token,
            walletAddress: verifyData.walletAddress,
          },
          window.location.origin
        )
      }
    } catch (err: any) {
      setError(err.message || "Connection failed")
      setExtensionSetupStep("connect")
    }
  }

  const finishVerify = () => {
    setExtensionConnected(true)
    setExtensionSetupStep("done")
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isConnected) {
    return (
      <Card className="p-6 bg-white/[0.04] border-white/10">
        <h3 className="text-white font-semibold mb-2">Extension Setup Locked</h3>
        <p className="text-white/60 text-sm mb-4">Connect wallet first to access extension setup.</p>
        <Link href="/dashboard">
          <Button className="bg-accent-blue text-white">Back to Dashboard</Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-1" />Dashboard
            </Button>
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-accent-blue" />Extension Setup
        </h2>
      </div>

      <Card className="p-4 bg-white/[0.04] border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          {["install", "connect", "signing", "verify", "done"].map((s, i) => {
            const done = STEP_ORDER.indexOf(step) > i
            const active = step === s
            return (
              <div key={s} className={`rounded-lg px-2 py-2 border ${active ? "border-accent-blue text-accent-blue" : done ? "border-green-400/30 text-green-300" : "border-white/10 text-white/40"}`}>
                {i + 1}. {s}
              </div>
            )
          })}
        </div>
      </Card>

      {step === "install" && (
        <Card className="p-6 bg-white/[0.04] border-white/10 space-y-4">
          <h3 className="text-white font-semibold flex items-center gap-2"><Download className="w-4 h-4 text-accent-blue" />Step 1: Install Extension</h3>
          <p className="text-white/60 text-sm">Install SIFIX extension. If already installed, click button below.</p>
          <Button onClick={markInstalled} className="bg-accent-blue text-white">I Have Installed Extension</Button>
        </Card>
      )}

      {step === "connect" && (
        <Card className="p-6 bg-white/[0.04] border-white/10 space-y-4">
          <h3 className="text-white font-semibold flex items-center gap-2"><Link2 className="w-4 h-4 text-accent-blue" />Step 2: Connect Wallet</h3>
          <Button onClick={handleConnect} className="w-full bg-accent-blue text-white">Connect Wallet</Button>
          {error && <p className="text-sm text-accent-red">{error}</p>}
        </Card>
      )}

      {step === "signing" && (
        <Card className="p-6 bg-white/[0.04] border-white/10 text-center">
          <Loader2 className="w-8 h-8 text-accent-blue animate-spin mx-auto mb-3" />
          <p className="text-white">Signing message in wallet...</p>
        </Card>
      )}

      {step === "verify" && (
        <Card className="p-6 bg-white/[0.04] border-white/10 space-y-4">
          <h3 className="text-white font-semibold flex items-center gap-2"><FileSignature className="w-4 h-4 text-accent-blue" />Step 4: Verify in Extension</h3>
          <div className="bg-[#111] rounded-xl p-3 font-mono text-xs break-all text-accent-blue border border-white/5">
            {token ? `${token.slice(0, 12)}${"•".repeat(24)}${token.slice(-6)}` : ""}
          </div>
          <Button onClick={handleCopy} variant="outline" className="border-white/20 text-white">{copied ? <><Check className="w-3 h-3 mr-1" />Copied</> : <><Copy className="w-3 h-3 mr-1" />Copy Token</>}</Button>
          <p className="text-xs text-white/40">Paste token in extension if auto sync fails.</p>
          <Button onClick={finishVerify} className="bg-accent-blue text-white">Extension Verified</Button>
        </Card>
      )}

      {step === "done" && (
        <Card className="p-6 border-accent-blue/30 bg-white/[0.04]">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="w-5 h-5 text-accent-blue" />
            <h3 className="text-accent-blue font-semibold">Setup Complete</h3>
          </div>
          <p className="text-white/60 text-sm mb-3">Extension active. Status saved persist.</p>
          <p className="text-xs text-white/40">Installed: {extensionInstalled ? "yes" : "no"} • Connected: {extensionConnected ? "yes" : "no"}</p>
          {walletAddress && <p className="text-xs text-white/40 mt-1">Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>}
          {expiresAt && <p className="text-xs text-white/40 mt-1">Valid until: {new Date(expiresAt).toLocaleDateString()}</p>}
          <Link href="/dashboard" className="block mt-4">
            <Button className="w-full bg-accent-blue text-white">Back to Dashboard <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
