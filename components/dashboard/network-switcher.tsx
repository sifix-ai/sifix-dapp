"use client";

import { useState } from "react";
import { useSwitchChain, useChainId, useAccount } from "wagmi";
import { ChevronDown, Check } from "lucide-react";

const SUPPORTED_NETWORKS = [
  {
    id: 16602,
    name: "0G Newton Testnet",
    color: "bg-green-500",
    rpc: "https://evmrpc-testnet.0g.ai",
    explorer: "https://chainscan-newton.0g.ai"
  }
] as const;

export function NetworkSwitcher() {
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState(false);

  const currentNetwork = SUPPORTED_NETWORKS.find(n => n.id === chainId);
  const isCorrectNetwork = chainId === 16602;

  const handleSwitch = async (targetChainId: number) => {
    try {
      await switchChain({ chainId: targetChainId });
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
          isCorrectNetwork
            ? "bg-green-500/10 border-green-500/20 text-green-400"
            : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}
      >
        <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
        <span className="text-xs font-medium">
          {currentNetwork?.name || "Wrong Network"}
        </span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-card-border bg-card shadow-xl z-20">
            <div className="p-2">
              <p className="px-3 py-2 text-xs text-muted border-b border-card-border">
                Select Network
              </p>
              {SUPPORTED_NETWORKS.map((network) => {
                const isCurrent = chainId === network.id;
                return (
                  <button
                    key={network.id}
                    onClick={() => handleSwitch(network.id)}
                    disabled={isSwitching}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      isCurrent
                        ? "bg-accent/20 text-accent"
                        : "text-muted hover:bg-surface hover:text-foreground"
                    } ${isSwitching ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${network.color}`} />
                      <span>{network.name}</span>
                    </div>
                    {isCurrent && <Check size={14} />}
                  </button>
                );
              })}
            </div>

            {/* Network Info */}
            {currentNetwork && (
              <div className="border-t border-card-border p-3 space-y-1">
                <p className="text-xs text-muted">Network Details</p>
                <div className="space-y-0.5">
                  <p className="text-xs font-mono text-muted break-all">
                    RPC: {currentNetwork.rpc}
                  </p>
                  <p className="text-xs font-mono text-muted break-all">
                    Explorer: {currentNetwork.explorer}
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}