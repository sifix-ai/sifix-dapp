'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex items-center gap-3">
        <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm font-mono">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
        <Button
          onClick={() => disconnect()}
          variant="outline"
          size="sm"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => connect({ connector: connectors[0] })}
      variant="default"
      size="sm"
    >
      Connect Wallet
    </Button>
  );
}
