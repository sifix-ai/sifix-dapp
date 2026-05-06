"use client";

export function BackgroundPaths({
  title = "Ready to Protect Your Assets",
  subtitle = "Join thousands of users protecting their crypto with AI-powered security",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="relative min-h-[70vh] w-full flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="flex flex-col items-end absolute -right-60 -top-10 blur-xl animate-pulse">
          <div className="h-[10rem] rounded-full w-[60rem] bg-gradient-to-b blur-[6rem] from-[#ff6b6b] to-[#4ecdc4]"></div>
        </div>
        <div className="flex flex-col items-start absolute -left-60 bottom-0 blur-xl animate-pulse" style={{ animationDelay: '1s' }}>
          <div className="h-[10rem] rounded-full w-[60rem] bg-gradient-to-b blur-[6rem] from-[#4ecdc4] to-[#ff6b6b]"></div>
        </div>
      </div>

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 107, 107, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 107, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Animated text */}
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 tracking-tight text-white">
              {title.split(" ").map((word, i) => (
                <span
                  key={i}
                  className="inline-block mr-4 last:mr-0"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${i * 0.1}s both`
                  }}
                >
                  {word}
                </span>
              ))}
            </h1>
          </div>

          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto" style={{
            animation: 'fadeInUp 0.6s ease-out 0.4s both'
          }}>
            {subtitle}
          </p>

          {/* CTA Button */}
          <div style={{
            animation: 'fadeInUp 0.6s ease-out 0.6s both'
          }}>
            <a
              href="/dashboard"
              className="inline-flex items-center group relative px-12 py-6 text-lg font-semibold rounded-full bg-gradient-0g text-white hover:shadow-glow-accent transition-all duration-300"
            >
              <span className="opacity-90 group-hover:opacity-100 transition-opacity flex items-center">
                Launch Dashboard
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </span>
            </a>
          </div>

          {/* Features pills */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4" style={{
            animation: 'fadeInUp 0.6s ease-out 0.8s both'
          }}>
            {[
              { icon: "⚡", label: "Real-Time Protection" },
              { icon: "🛡️", label: "AI Powered" },
              { icon: "🔒", label: "0G Chain Secured" },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] border border-white/[0.1] rounded-full text-white/80 text-sm"
                style={{
                  animation: `fadeIn 0.5s ease-out ${1 + i * 0.1}s both`
                }}
              >
                <span>{feature.icon}</span>
                <span>{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}
