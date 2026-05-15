'use client';

import { useState, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { readContract, waitForTransactionReceipt } from 'wagmi/actions';
import { hashReasonData, type ReasonData } from '@/lib/hash';
import { SIFIX_REPUTATION_ABI, SIFIX_REPUTATION_ADDRESS, SUPPORTED_CHAIN_IDS } from '@/config/contracts';
import { wagmiConfig } from '@/lib/wagmi';
import { isAddress } from 'viem';

type ThreatType = 0 | 1 | 2 | 3 | 4;

function mapThreatType(reasonData: ReasonData): ThreatType {
  const text = `${reasonData.selectedReasons.join(' ')} ${reasonData.customText}`.toLowerCase();
  if (text.includes('drainer') || text.includes('approve') || text.includes('drain')) return 1;
  if (text.includes('honeypot')) return 2;
  if (text.includes('rug')) return 3;
  if (text.includes('phishing') || text.includes('fake') || text.includes('impersonation')) return 0;
  return 4;
}

function mapSeverity(reasonData: ReasonData, threatType: ThreatType): number {
  const text = `${reasonData.selectedReasons.join(' ')} ${reasonData.customText}`.toLowerCase();
  if (text.includes('critical') || text.includes('drain') || text.includes('stolen')) return 9;
  if (threatType === 1 || threatType === 3) return 8;
  if (threatType === 0 || threatType === 2) return 7;
  return 6;
}

export type ReportStep = 'idle' | 'wallet' | 'confirming' | 'saving' | 'success' | 'error';

export interface UseReportScamReturn {
  step: ReportStep;
  txHash: `0x${string}` | undefined;
  error: string | null;
  isLoading: boolean;
  submit: (params: { targetAddress: string; reasonData: ReasonData; reporterAddress: string; chainId: number }) => Promise<void>;
  reset: () => void;
}

export function useReportScam(): UseReportScamReturn {
  const [step, setStep] = useState<ReportStep>('idle');
  const [error, setError] = useState<string | null>(null);
  const { writeContractAsync } = useWriteContract();
  const [pendingTxHash, setPendingTxHash] = useState<`0x${string}` | undefined>(undefined);

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: pendingTxHash });

  const resolvedStep: ReportStep =
    step === 'confirming' && isConfirmed ? 'success' : step === 'confirming' && isConfirming ? 'confirming' : step;

  const submit = useCallback(async ({ targetAddress, reasonData, reporterAddress, chainId }: { targetAddress: string; reasonData: ReasonData; reporterAddress: string; chainId: number }) => {
    setError(null);
    try {
      if (!(SUPPORTED_CHAIN_IDS as readonly number[]).includes(chainId)) throw new Error('Unsupported chain. Please connect to 0G Galileo testnet.');
      if (!isAddress(targetAddress.trim())) throw new Error('SIFIX on-chain report requires wallet/contract address target.');
      if (!isAddress(reporterAddress)) throw new Error('Invalid reporter wallet address. Please reconnect wallet and try again.');

      const { validateAddressOnChain } = await import('@/lib/chain-validation');
      const check = await validateAddressOnChain(targetAddress, '0g-galileo');
      const hasNoChainActivityYet = check.validFormat && !check.existsOnChain && !check.rpcUnavailable;
      if (hasNoChainActivityYet) {
        console.warn('[use-report-scam] target has no onchain activity yet on 0G Galileo; allowing report anyway', {
          targetAddress,
          explorerUrl: check.explorerUrl,
        });
      }

      const alreadyReported = await readContract(wagmiConfig, {
        address: SIFIX_REPUTATION_ADDRESS,
        abi: SIFIX_REPUTATION_ABI,
        functionName: 'hasReportedTarget',
        args: [targetAddress as `0x${string}`, reporterAddress as `0x${string}`],
        chainId,
      });
      if (alreadyReported) throw new Error('You have already reported this target on-chain.');

      const threatType = mapThreatType(reasonData);
      const severity = mapSeverity(reasonData, threatType);
      const evidenceHash = hashReasonData(reasonData);

      setStep('wallet');
      const txHash = await writeContractAsync({
        address: SIFIX_REPUTATION_ADDRESS,
        abi: SIFIX_REPUTATION_ABI,
        functionName: 'submitReport',
        args: [targetAddress as `0x${string}`, threatType, evidenceHash, severity],
        chainId,
      });

      setPendingTxHash(txHash);
      setStep('confirming');

      const receipt = await waitForTransactionReceipt(wagmiConfig, { chainId, hash: txHash, confirmations: 1 });
      if (receipt.status !== 'success') throw new Error('Transaction reverted on-chain. Contract rejected this report.');
      setStep('success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      const mapped = msg.includes('User rejected') || msg.includes('user rejected') ? 'Transaction cancelled.'
        : msg.includes('AlreadyReported') ? 'You have already reported this target on-chain.'
        : msg.includes('InvalidSeverity') ? 'Invalid severity. Please try again.'
        : msg.includes('InvalidTarget') ? 'Invalid target address.'
        : msg;
      setError(mapped);
      setStep('error');
    }
  }, [writeContractAsync]);

  const reset = useCallback(() => {
    setStep('idle');
    setError(null);
    setPendingTxHash(undefined);
  }, []);

  return { step: resolvedStep, txHash: pendingTxHash, error, isLoading: resolvedStep === 'wallet' || resolvedStep === 'confirming' || resolvedStep === 'saving', submit, reset };
}
