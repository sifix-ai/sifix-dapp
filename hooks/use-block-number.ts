"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";

export function useBlockNumber() {
  const publicClient = usePublicClient();
  const [blockNumber, setBlockNumber] = useState<bigint>(BigInt(0));
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (!publicClient) return;

    // Get initial block number
    publicClient.getBlockNumber().then(setBlockNumber);

    // Watch for new blocks
    const unwatch = publicClient.watchBlocks({
      onBlock: (block) => {
        setBlockNumber(block.number);
        setIsUpdated(true);
        // Reset the update flag after a short delay
        setTimeout(() => setIsUpdated(false), 1000);
      },
      includeTransactions: false,
    });

    return () => {
      unwatch();
    };
  }, [publicClient]);

  return { blockNumber, isUpdated };
}