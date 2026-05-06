import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ErrorBoundary } from "@/components/error-boundary";

// Validate environment on server startup
if (typeof window === "undefined") {
  const { validateEnv } = require("@/lib/env-validation");
  validateEnv();
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SIFIX - AI-Powered Wallet Security on 0G Chain",
  description: "Protect your crypto assets with AI-powered transaction analysis on 0G Newton Testnet",
  keywords: ["0G", "blockchain", "security", "AI", "wallet", "threat detection"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
