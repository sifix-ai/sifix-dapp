import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Shield, Zap, TrendingUp } from 'lucide-react'
import { ReactNode } from 'react'

export function FeaturesSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl text-white">
                        How SIFIX <span className="text-[#FF6363]">Protects</span> You
                    </h2>
                    <p className="mt-4 text-white/60">
                        Three-layer security system powered by AI and blockchain
                    </p>
                </div>
                <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">
                    <Card className="group border-0 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-none hover:bg-white/[0.05] transition-all duration-300">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Shield className="size-6 text-[#FF6363]" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium text-white">Transaction Interception</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm text-white/60">
                                Browser extension intercepts every transaction before you sign. Real-time analysis prevents malicious TX from executing.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group border-0 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-none hover:bg-white/[0.05] transition-all duration-300">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Zap className="size-6 text-[#55b3ff]" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium text-white">AI Risk Analysis</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm text-white/60">
                                GPT-4 powered agent simulates transactions and analyzes risks with 95%+ accuracy in under 100ms.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group border-0 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-none hover:bg-white/[0.05] transition-all duration-300">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <TrendingUp className="size-6 text-[#5fc992]" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium text-white">On-Chain Reputation</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm text-white/60">
                                Threat reports stored on 0G Chain. Build decentralized reputation system for addresses.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div aria-hidden className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
        <div className="absolute inset-0 [--border:white] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"/>
        <div className="bg-[#07080a] absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l border-white/[0.08]">{children}</div>
    </div>
)
