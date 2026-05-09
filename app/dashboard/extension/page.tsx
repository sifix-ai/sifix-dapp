"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, Copy, Check, ExternalLink, ArrowLeft, Loader2, Key, CheckCircle2, ArrowRight } from "lucide-react"
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
      setError("No Web3 wallet detected. Please install MetaMask or compatible wallet.")
      return
    }

    try {
      setStep("signing")

      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (!accounts.length) {
        setError("No wallet account detected")
        setStep("connect")
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
      setStep("done")

      if (typeof window !== "undefined") {
        window.postMessage({
          type: "SIFIX_EXTENSION_TOKEN",
          token: verifyData.token,
          walletAddress: verifyData.walletAddress,
        }, window.location.origin)
        console.log("[SIFIX] Token sent to extension via postMessage")
      }
    } catch (err: any) {
      setError(err.message || "Connection failed")
      setStep("connect")
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Dashboard
            </Button>
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-accent-blue" />
          Extension Setup
        </h2>
        <p className="text-white/60 mt-1">
          Connect your wallet to generate an API token and activate the SIFIX browser extension.
        </p>
      </div>

      {/* Step: Connect */}
      {step === "connect" && (
        <Card className="p-6 bg-white/[0.04] backdrop-blur-md border-white/15">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 flex items-center justify-center border border-accent-blue/20">
              <Key className="w-5 h-5 text-accent-blue" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Step 1: Connect Wallet</h3>
              <p className="text-xs text-white/40">Sign a message to verify your identity. No gas fee required.</p>
            </div>
          </div>

          <Button
            onClick={handleConnect}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-accent-blue/80 to-accent-blue text-white hover:shadow-lg hover:shadow-accent-blue/20 transition-all text-sm font-medium"
            size="lg"
          >
            Connect Wallet
          </Button>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {error}
            </div>
          )}
        </Card>
      )}

      {/* Step: Signing */}
      {step === "signing" && (
        <Card className="p-6 bg-white/[0.04] backdrop-blur-md border-white/15">
          <div className="flex flex-col items-center py-4">
            <Loader2 className="w-10 h-10 text-accent-blue mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-white mb-2">Signing Message</h3>
            <p className="text-white/50 text-sm text-center max-w-xs">
              Please confirm the signature in your wallet. No gas fee will be charged.
            </p>
            {error && (
              <div className="mt-4 p-3 rounded-xl bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Step: Done */}
      {step === "done" && (
        <div className="space-y-4">
          {/* Success Card */}
          <Card className="p-6 border-accent-blue/30 bg-white/[0.04] backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center border border-accent-blue/20">
                <CheckCircle2 className="w-5 h-5 text-accent-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-accent-blue">Token Generated</h3>
                <p className="text-white/40 text-xs">
                  Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-accent-blue/10 border border-accent-blue/20">
              <p className="text-xs text-accent-blue flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Token sent to SIFIX Extension automatically. Open the extension popup now.
              </p>
            </div>
          </Card>

          {/* Token Display */}
          <Card className="p-6 bg-white/[0.04] backdrop-blur-md border-white/15">
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-4 h-4 text-white/40" />
              <h4 className="text-sm font-medium text-white/60">API Token</h4>
            </div>
            <div className="relative">
              <div className="bg-[#111] rounded-xl p-4 pr-24 font-mono text-xs break-all text-accent-blue border border-white/5">
                {token ? `${token.slice(0, 12)}${"•".repeat(24)}${token.slice(-6)}` : ""}
              </div>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 px-3 py-2 rounded-lg bg-accent-blue/20 hover:bg-accent-blue/30 transition-colors flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-accent-blue" />
                    <span className="text-xs text-accent-blue">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-accent-blue" />
                    <span className="text-xs text-accent-blue">Copy</span>
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
          <Card className="p-6 bg-white/[0.04] backdrop-blur-md border-white/15">
            <h4 className="text-sm font-medium text-white/80 mb-4">
              How to use the extension:
            </h4>
            <ol className="space-y-3 text-sm text-white/60">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue text-xs font-bold shrink-0">1</span>
                <span>Open the SIFIX extension in your browser toolbar</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue text-xs font-bold shrink-0">2</span>
                <span>
                  Click <strong className="text-white/80">&quot;Paste token manually&quot;</strong> if auto-connect failed
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue text-xs font-bold shrink-0">3</span>
                <span>
                  Paste the token above and click <strong className="text-white/80">Connect</strong>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue text-xs font-bold shrink-0">
                  <Check className="w-3 h-3" />
                </span>
                <span>The extension is now active and will protect your transactions</span>
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
              <Button className="w-full bg-gradient-to-r from-accent-blue/80 to-accent-blue text-white hover:shadow-lg hover:shadow-accent-blue/20 transition-all">
                Back to Dashboard
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
