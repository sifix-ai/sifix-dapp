'use client';

import { Shield, Brain, Zap, Database, Users, Lock, Eye, MessageSquare, DollarSign, AlertTriangle, LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { FeatureCard } from '@/components/ui/grid-feature-cards';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

const coreFeatures = [
  {
    title: 'Real-time Protection',
    icon: Shield,
    description: 'Intercept and analyze transactions before execution to prevent malicious interactions.',
  },
  {
    title: 'AI-Powered Analysis',
    icon: Brain,
    description: 'GPT-4 evaluates transaction risks and explains potential threats in plain language.',
  },
  {
    title: 'Transaction Simulation',
    icon: Zap,
    description: 'Safe testing environment simulates transactions to reveal hidden risks before execution.',
  },
  {
    title: '0G Storage',
    icon: Database,
    description: 'Decentralized threat intelligence stored permanently on 0G Chain for community access.',
  },
  {
    title: 'Community-Driven',
    icon: Users,
    description: 'Collaborative security where users contribute to and benefit from shared threat data.',
  },
  {
    title: 'On-chain Reputation',
    icon: Lock,
    description: 'Transparent reputation system tracks malicious addresses and rewards security contributors.',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-16 md:py-32 relative bg-canvas overflow-visible">
      {/* Atmospheric glow - blue accent - subtle */}
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-accent-blue-glow rounded-full blur-3xl opacity-15" />
      </div>

      <div className="mx-auto w-full max-w-6xl space-y-16 px-4 md:px-8 relative z-10">
        {/* Header Section */}
        <AnimatedContainer className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-hairline-strong rounded-full mb-8">
            <span className="text-xs font-medium text-body tracking-wide">FEATURES</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight text-ink mb-6 font-normal">
            Complete Protection
          </h2>
          <p className="text-muted-foreground text-base md:text-lg tracking-wide text-balance">
            Everything you need to stay safe in Web3, powered by AI and decentralized storage.
          </p>
        </AnimatedContainer>

        {/* Core Features Grid */}
        <AnimatedContainer
          delay={0.2}
          className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2 md:grid-cols-3"
        >
          {coreFeatures.map((feature, i) => (
            <FeatureCard key={i} feature={feature} />
          ))}
        </AnimatedContainer>

        {/* Advanced Features Cards */}
        <AnimatedContainer delay={0.4} className="grid gap-6 lg:grid-cols-2">
          <FeatureCardAdvanced>
            <CardHeader className="pb-3">
              <CardHeading
                icon={Shield}
                title="Real-time Protection"
                description="Advanced AI analysis system that instantly detects threats before you sign."
              />
            </CardHeader>
            <div className="relative mb-6 border-t border-hairline sm:mb-0">
              <div className="absolute inset-0 [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,var(--surface-card),var(--canvas)_125%)]"></div>
              <div className="aspect-[76/59] p-1 px-6">
                <img
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80"
                  className="w-full h-full object-cover rounded-md border border-hairline"
                  alt="Security dashboard illustration"
                  width={1207}
                  height={929}
                />
              </div>
            </div>
          </FeatureCardAdvanced>

          <FeatureCardAdvanced>
            <CardHeader className="pb-3">
              <CardHeading
                icon={Lock}
                title="On-Chain Reputation"
                description="Community-driven security scores stored permanently on 0G Chain."
              />
            </CardHeader>
            <CardContent>
              <div className="relative mb-6 sm:mb-0">
                <div className="absolute -inset-6 [background:radial-gradient(50%_50%_at_75%_50%,transparent,var(--canvas)_100%)]"></div>
                <div className="aspect-[76/59] border border-hairline-strong rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&q=80"
                    className="w-full h-full object-cover"
                    alt="Blockchain network illustration"
                    width={1207}
                    height={929}
                  />
                </div>
              </div>
            </CardContent>
          </FeatureCardAdvanced>

          <FeatureCardAdvanced className="p-8 lg:col-span-2">
            <p className="mx-auto my-6 max-w-2xl text-balance text-center text-2xl md:text-3xl font-normal text-ink leading-tight">
              Smart threat detection with automated alerts for suspicious transactions.
            </p>
            <div className="flex justify-center gap-6 overflow-hidden">
              <CircularUI
                label="Verified"
                circles={[{ pattern: 'border' }, { pattern: 'border' }]}
              />
              <CircularUI
                label="Protected"
                circles={[{ pattern: 'none' }, { pattern: 'primary' }]}
              />
              <CircularUI
                label="Secured"
                circles={[{ pattern: 'blue' }, { pattern: 'none' }]}
              />
              <CircularUI
                label="Monitored"
                circles={[{ pattern: 'primary' }, { pattern: 'none' }]}
                className="hidden sm:block"
              />
            </div>
          </FeatureCardAdvanced>
        </AnimatedContainer>

        {/* Bottom badges */}
        <AnimatedContainer delay={0.6} className="flex flex-wrap justify-center gap-3">
          <div className="px-4 py-2 bg-surface-elevated border border-hairline-strong rounded-full text-xs text-body">
            Free to use
          </div>
          <div className="px-4 py-2 bg-surface-elevated border border-hairline-strong rounded-full text-xs text-body">
            Open source
          </div>
          <div className="px-4 py-2 bg-surface-elevated border border-hairline-strong rounded-full text-xs text-body">
            Privacy-first
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}

// Animation Container Component
type ViewAnimationProps = {
  delay?: number;
  className?: React.ComponentProps<typeof motion.div>['className'];
  children: React.ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Advanced Feature Card Components
interface FeatureCardAdvancedProps {
  children: ReactNode;
  className?: string;
}

const FeatureCardAdvanced = ({ children, className }: FeatureCardAdvancedProps) => (
  <Card className={cn('group relative rounded-lg shadow-none border-hairline-strong bg-surface-card', className)}>
    <CardDecorator />
    {children}
  </Card>
);

const CardDecorator = () => (
  <>
    <span className="absolute -left-px -top-px block size-2 border-l-2 border-t-2 border-accent-blue"></span>
    <span className="absolute -right-px -top-px block size-2 border-r-2 border-t-2 border-accent-blue"></span>
    <span className="absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 border-accent-blue"></span>
    <span className="absolute -bottom-px -right-px block size-2 border-b-2 border-r-2 border-accent-blue"></span>
  </>
);

interface CardHeadingProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const CardHeading = ({ icon: Icon, title, description }: CardHeadingProps) => (
  <div className="p-6">
    <span className="flex items-center gap-2 text-charcoal">
      <Icon className="size-4" />
      {title}
    </span>
    <p className="mt-8 text-2xl font-medium text-ink leading-tight">{description}</p>
  </div>
);

interface CircleConfig {
  pattern: 'none' | 'border' | 'primary' | 'blue';
}

interface CircularUIProps {
  label: string;
  circles: CircleConfig[];
  className?: string;
}

const CircularUI = ({ label, circles, className }: CircularUIProps) => (
  <div className={className}>
    <div className="bg-gradient-to-b from-hairline-strong to-transparent size-fit rounded-2xl p-px">
      <div className="bg-gradient-to-b from-surface-card to-surface-elevated relative flex aspect-square w-fit items-center -space-x-4 rounded-[15px] p-4">
        {circles.map((circle, i) => (
          <div
            key={i}
            className={cn('size-7 rounded-full border sm:size-8', {
              'border-hairline-strong': circle.pattern === 'none',
              'border-hairline-strong bg-[repeating-linear-gradient(-45deg,var(--hairline),var(--hairline)_1px,transparent_1px,transparent_4px)]':
                circle.pattern === 'border',
              'border-hairline-strong bg-surface-card bg-[repeating-linear-gradient(-45deg,var(--primary),var(--primary)_1px,transparent_1px,transparent_4px)]':
                circle.pattern === 'primary',
              'bg-surface-card z-1 border-accent-blue bg-[repeating-linear-gradient(-45deg,var(--accent-blue),var(--accent-blue)_1px,transparent_1px,transparent_4px)]':
                circle.pattern === 'blue',
            })}
          ></div>
        ))}
      </div>
    </div>
    <span className="mt-1.5 block text-center text-sm text-charcoal">{label}</span>
  </div>
);
