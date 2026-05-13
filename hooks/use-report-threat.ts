'use client';

import { useState, useCallback } from 'react';
import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { hashReasonData, type ReasonData } from '@/lib/hash';
import {
  SCAM_REPORTER_ABI,
  SIFIX_REPUTATION_ADDRESS,
  SUPPORTED_CHAIN_IDS,
} from '@/config/contracts';
import { wagmiConfig } from '@/lib/wagmi';
import { isAddress, keccak256, pad, toBytes } from 'viem';

export type ReportStep =
  | 'idle'
  | 'wallet'
  | 'confirming'
  | 'saving'
  | 'success'
  | 'error';

export interface UseReportThreatReturn {
  step: ReportStep;
  txHash: `0x${string}` | undefined;
  error: string | null;
  isLoading: boolean;
  submit: (params: {
    targetAddress: string;
    reasonData: ReasonData;
    reporterAddress: string;
    chainId: number;
  }) => Promise<void>;
  reset: () => void;
}

function getTargetTypeAndId(target: string): { targetType: number; targetId: `0x${string}` } {
  const normalized = target.trim();

  if (isAddress(normalized)) {
    return {
      targetType: 0,
      targetId: pad(normalized.toLowerCase() as `0x${string}`, { size: 32 }),
    };
  }

  const normalizedText = normalized.toLowerCase();
  const targetType = normalizedText.endsWith('.eth') ? 1 : 2;
  return {
    targetType,
    targetId: keccak256(toBytes(normalizedText)),
  };
}

export function useReportThreat(): UseReportThreatReturn {
  const [step, setStep] = useState<ReportStep>('idle');
  const [error, setError] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();
  const [pendingTxHash, setPendingTxHash] = useState<`0x${string}` | undefined>(undefined);

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: pendingTxHash,
  });

  // Mirror on-chain confirmation in our step machine
  const resolvedStep: ReportStep =
    step === 'confirming' && isConfirmed ? 'success'
    : step === 'confirming' && isConfirming ? 'confirming'
    : step === 'success' ? 'success'
    : step;

  const submit = useCallback(
    async ({
      targetAddress,
      reasonData,
      reporterAddress,
      chainId,
    }: {
      targetAddress: string;
      reasonData: ReasonData;
      reporterAddress: string;
      chainId: number;
    }) => {
      setError(null);

      const isChainSupported = (SUPPORTED_CHAIN_IDS as readonly number[]).includes(chainId);

      try {
        // 1. Hash reason data deterministically
        const reasonHash = hashReasonData(reasonData);
        const { targetType, targetId } = getTargetTypeAndId(targetAddress);

        // Build a human-readable reason string for the `reason` field
        const reasonText = [
          ...reasonData.selectedReasons,
          reasonData.customText ? `Custom: ${reasonData.customText}` : '',
        ]
          .filter(Boolean)
          .join(', ') || 'Reported as threat';

        if (!isChainSupported) {
          throw new Error('Unsupported chain. Please connect to 0G Galileo testnet.');
        }

        // Validate target address exists on-chain
        if (isAddress(targetAddress.trim())) {
          const { validateAddressOnChain } = await import('@/lib/chain-validation')
          const chainKey = chainId === 16602 ? '0g-galileo' : 'ethereum'
          const check = await validateAddressOnChain(targetAddress, chainKey)
          if (check.validFormat && !check.existsOnChain && !check.rpcUnavailable) {
            throw new Error('Address not found on-chain. Please check the address and try again.')
          }
        }

        // 2. Trigger wallet for on-chain submission FIRST
        setStep('wallet');
        const txHash = await writeContractAsync({
          address: SIFIX_REPUTATION_ADDRESS,
          abi: SCAM_REPORTER_ABI,
          functionName: 'submitVote',
          args: [targetType, targetId, reasonHash, true],
          chainId,
        });

        setPendingTxHash(txHash);
        setStep('confirming');

        // 3. Wait for on-chain confirmation
        const receipt = await waitForTransactionReceipt(wagmiConfig, {
          chainId,
          hash: txHash,
          confirmations: 1,
        });

        if (receipt.status !== 'success') {
          throw new Error('Transaction reverted on-chain. Contract rejected this report.')
        }

        // 4. On-chain confirmed — success handled by indexer sync pipeline
        setStep('success');
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message.includes('User rejected') || err.message.includes('user rejected')
              ? 'Transaction cancelled.'
              : err.message.includes('AlreadyVoted')
                ? 'You have already voted for this target on-chain.'
              : err.message
            : 'An unexpected error occurred.';
        setError(message);
        setStep('error');
      }
    },
    [writeContractAsync]
  );

  const reset = useCallback(() => {
    setStep('idle');
    setError(null);
    setPendingTxHash(undefined);
  }, []);

  return {
    step: resolvedStep,
    txHash: pendingTxHash,
    error,
    isLoading:
      resolvedStep === 'wallet' ||
      resolvedStep === 'confirming' ||
      resolvedStep === 'saving',
    submit,
    reset,
  };
}
