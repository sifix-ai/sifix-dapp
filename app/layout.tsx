import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SIFIX - AI-Powered Wallet Security',
  description: 'Autonomous AI agent that protects Web3 users by intercepting wallet transactions, analyzing risks, and reporting threats on-chain.',
  keywords: ['Web3', 'Security', 'AI', 'Blockchain', '0G Chain', 'Wallet Protection'],
  authors: [{ name: 'SIFIX Team' }],
  openGraph: {
    title: 'SIFIX - AI-Powered Wallet Security',
    description: 'Protect your Web3 transactions with AI-powered threat detection',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
