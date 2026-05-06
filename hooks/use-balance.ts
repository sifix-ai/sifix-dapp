"use client";

import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { formatUnits } from "viem";

export function useBalance() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [balance, setBalance] = useState<bigint>(0n);
  const [formattedBalance, setFormattedBalance] = useState<string>("");

  useEffect(() => {
    if (address && publicClient) {
      publicClient.getBalance({ address }).then((balance) => {
        setBalance(balance);
        setFormattedBalance(parseFloat(formatUnits(balance, 18)).toFixed(4));
      }).catch((error) => {
        console.error("Failed to fetch balance:", error);
        setBalance(0n);
        setFormattedBalance("");
      });
    }
  }, [address, publicClient]);

  return { balance, formattedBalance };
}