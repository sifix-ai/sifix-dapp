"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { estimateGasForReport } from "@/lib/contract";

export function useGasEstimation() {
  const { address } = useAccount();
  const [gasEstimate, setGasEstimate] = useState<{
    gasCost: string;
    gasEstimate: bigint;
    loading: boolean;
    error?: string;
  }>({
    gasCost: "0",
    gasEstimate: 0n,
    loading: false
  });

  const estimateGas = async (targetAddress: string, severity: number, evidenceHash: string) => {
    if (!address) {
      setGasEstimate(prev => ({
        ...prev,
        error: "Wallet not connected"
      }));
      return;
    }

    setGasEstimate(prev => ({ ...prev, loading: true, error: undefined }));

    try {
      const result = await estimateGasForReport(
        targetAddress as `0x${string}`,
        severity,
        evidenceHash
      );

      if (result.error) {
        setGasEstimate(prev => ({
          ...prev,
          loading: false,
          error: result.error
        }));
      } else {
        setGasEstimate({
          gasCost: result.gasCost,
          gasEstimate: result.gasEstimate,
          loading: false
        });
      }
    } catch (error) {
      setGasEstimate(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Gas estimation failed"
      }));
    }
  };

  return {
    gasEstimate,
    estimateGas,
    resetGasEstimate: () => setGasEstimate({
      gasCost: "0",
      gasEstimate: 0n,
      loading: false
    })
  };
}