import type { Metadata } from "next";
import { Inter, Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ErrorBoundary } from "@/components/error-boundary";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900']
});

// Validate environment on server startup
if (typeof window === "undefined") {
  const { validateEnv } = require("@/lib/env-validation");
  validateEnv();
}

export const metadata: Metadata = {
  title: "SIFIX - AI-Powered Wallet Security on 0G Chain",
  description: "Protect your crypto assets with AI-powered transaction analysis on 0G Galileo Testnet",
  keywords: ["0G", "blockchain", "security", "AI", "wallet", "threat detection"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, inter.variable, playfair.variable)}>
      <body className={cn(inter.className, "bg-canvas text-ink antialiased")}>
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
