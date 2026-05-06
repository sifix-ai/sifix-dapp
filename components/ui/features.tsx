"use client";

import { Shield, ShieldCheck, Database, Search, Activity, Trophy } from "lucide-react";
import React from "react";

export function Features() {
  return (
    <section id="features" className="py-16 md:py-32">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-white">
            Built to cover your needs
          </h2>
          <p className="mt-4 text-white/60 text-lg">
            Comprehensive security suite powered by AI and blockchain technology
          </p>
        </div>

        <div className="grid max-w-sm gap-6 md:grid-cols-3 mx-auto">
          <Card className="group border-0 bg-white/[0.02] hover:bg-white/[0.04] shadow-none transition-all">
            <CardHeader className="pb-3">
              <CardDecorator>
                <ShieldCheck className="size-6 text-[#ff6b6b]" aria-hidden />
              </CardDecorator>
              <h3 className="mt-6 font-medium text-white">Real-Time Protection</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/60">
                AI-powered transaction interception analyzes every transaction before you sign, preventing malicious activity in real-time.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 bg-white/[0.02] hover:bg-white/[0.04] shadow-none transition-all">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Database className="size-6 text-[#4ecdc4]" aria-hidden />
              </CardDecorator>
              <h3 className="mt-6 font-medium text-white">On-Chain Reputation</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/60">
                All threat reports stored on 0G Chain create an immutable reputation system for addresses and contracts.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 bg-white/[0.02] hover:bg-white/[0.04] shadow-none transition-all">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Search className="size-6 text-blue-400" aria-hidden />
              </CardDecorator>
              <h3 className="mt-6 font-medium text-white">Smart Analysis</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/60">
                GPT-4 powered simulation with 95%+ accuracy detects phishing, rug pulls, and malicious contracts.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

const CardDecorator = ({ children }: { children: React.ReactNode }) => (
  <div aria-hidden className="relative mx-auto size-36 mask-image-radial">
    <style>{`
      .mask-image-radial {
        mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, #000 70%, transparent 100%);
        -webkit-mask-image: radial-gradient(ellipse 50% 50% at 50% 50%, #000 70%, transparent 100%);
      }
    `}</style>
    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-10" />
    <div className="bg-[#0a0a0f] absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l border-white/[0.1] rounded-full">
      {children}
    </div>
  </div>
);
