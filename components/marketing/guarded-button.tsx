"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";

type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type Size = "default" | "sm" | "lg" | "icon";

interface GuardedButtonProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

/**
 * Renders a Button that navigates directly to `href` when wallet is connected,
 * or to /connect?redirect=<href> when not connected.
 */
export function GuardedButton({
  href,
  variant = "default",
  size = "default",
  className,
  children,
}: GuardedButtonProps) {
  const { isConnected } = useAccount();
  const router = useRouter();

  const handleClick = useCallback(() => {
    if (isConnected) {
      router.push(href);
    } else {
      router.push(`/connect?redirect=${encodeURIComponent(href)}`);
    }
  }, [isConnected, href, router]);

  return (
    <Button variant={variant} size={size} className={className} onClick={handleClick}>
      {children}
    </Button>
  );
}
