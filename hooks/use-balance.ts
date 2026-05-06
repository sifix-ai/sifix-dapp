"use client";

import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { formatUnits } from "viem";

export function useBalance() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [formattedBalance, setFormattedBalance] = useState<string>("");

  useEffect(() => {
    if (address && publicClient) {
      publicClient.getBalance({ address }).then((balance) => {
        setBalance(balance);
        setFormattedBalance(parseFloat(formatUnits(balance, 18)).toFixed(4));
      }).catch((error) => {
        console.error("Failed to fetch balance:", error);
        setBalance(BigInt(0));
        setFormattedBalance("");
      });
    } else {
      setBalance(BigInt(0));
      setFormattedBalance("0.0000");
    }
  }, [address, publicClient]);

  return { balance, formattedBalance };
}
