'use client';

import dynamic from 'next/dynamic';
import { BlurReveal, TextReveal, CountUp } from '@/components/motion';

const CobeGlobe = dynamic(() => import('@/components/three/CobeGlobe'), {
  ssr: false,
  loading: () => <div className="w-[320px] h-[320px]" />,
});

export function SceneNumbers() {
  return (
    <section
      id="scene-numbers"
      data-scene="numbers"
      className="section-padding relative overflow-hidden"
      aria-label="Why choose us bento grid"
    >
      <div className="container-site">
        <BlurReveal>
          <span className="text-xs font-mono text-[#06B6D4] uppercase tracking-widest">
            / 05 — Why Choose Innovatech
          </span>
        </BlurReveal>

        <TextReveal
          text="Engineered for high scale, security, & speed."
          className="text-display-md font-display font-black text-[#F8FAFC] mt-3 mb-12"
          delay={0.2}
        />

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Card 1: Globe (Span 2 cols on lg) */}
          <BlurReveal className="md:col-span-2 lg:col-span-2" delay={0.2}>
            <div className="rounded-2xl glass p-8 border border-[rgba(255,255,255,0.08)] flex flex-col justify-between h-full relative overflow-hidden group">
              <div>
                <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-wider block mb-2">
                  ☁️ Global Edge Infrastructure
                </span>
                <h3 className="font-display font-bold text-2xl text-[#F8FAFC] mb-2">
                  Cloud Native Deployments
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm">
                  Sub-50ms latency everywhere on Earth through Vercel Edge & Cloudflare global nodes.
                </p>
              </div>

              {/* Globe container */}
              <div className="my-4 flex justify-center">
                <CobeGlobe />
              </div>
            </div>
          </BlurReveal>

          {/* Card 2: Lightning Speed */}
          <BlurReveal delay={0.3}>
            <div className="rounded-2xl glass p-6 border border-[rgba(255,255,255,0.08)] flex flex-col justify-between h-full">
              <span className="text-3xl mb-4 block">⚡</span>
              <div>
                <h3 className="font-display font-bold text-lg text-[#F8FAFC] mb-1">
                  Lightning Fast
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                  Sub-second LCP and near-zero CLS optimization on every single build.
                </p>
              </div>
              <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between font-mono text-xs text-[#3B82F6]">
                <span>Lighthouse Target</span>
                <span className="font-bold">95+ Score</span>
              </div>
            </div>
          </BlurReveal>

          {/* Card 3: Secure */}
          <BlurReveal delay={0.4}>
            <div className="rounded-2xl glass p-6 border border-[rgba(255,255,255,0.08)] flex flex-col justify-between h-full">
              <span className="text-3xl mb-4 block">🔒</span>
              <div>
                <h3 className="font-display font-bold text-lg text-[#F8FAFC] mb-1">
                  Enterprise Security
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                  Role-based Firebase Auth security rules, input validation via Zod, and sanitization.
                </p>
              </div>
              <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between font-mono text-xs text-[#06B6D4]">
                <span>Protection</span>
                <span className="font-bold">Encrypted</span>
              </div>
            </div>
          </BlurReveal>

          {/* Card 4: AI Powered */}
          <BlurReveal delay={0.45}>
            <div className="rounded-2xl glass p-6 border border-[rgba(255,255,255,0.08)] flex flex-col justify-between h-full">
              <span className="text-3xl mb-4 block">🤖</span>
              <div>
                <h3 className="font-display font-bold text-lg text-[#F8FAFC] mb-1">
                  AI Powered
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                  Automated content generation, video storytelling pipelines, and LLM integrations.
                </p>
              </div>
              <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between font-mono text-xs text-[#8B5CF6]">
                <span>Workflows</span>
                <span className="font-bold">Automated</span>
              </div>
            </div>
          </BlurReveal>

          {/* Card 5: Large Metric Card (Span 3 cols on lg) */}
          <BlurReveal className="md:col-span-2 lg:col-span-3" delay={0.5}>
            <div className="rounded-2xl glass p-8 border border-[rgba(255,255,255,0.08)] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-wider block mb-1">
                  🚀 Track Record
                </span>
                <h3 className="font-display font-bold text-xl text-[#F8FAFC]">
                  Trusted by ambitious startups & fast-growing digital brands
                </h3>
              </div>

              <div className="flex items-center gap-8 shrink-0">
                <div className="text-center">
                  <div className="text-3xl font-display font-black gradient-text">
                    <CountUp end={47} suffix="+" duration={2} />
                  </div>
                  <div className="text-[10px] text-[#64748B] uppercase tracking-widest font-mono">
                    Launches
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-display font-black gradient-text">
                    <CountUp end={100} suffix="%" duration={2} />
                  </div>
                  <div className="text-[10px] text-[#64748B] uppercase tracking-widest font-mono">
                    On-Time
                  </div>
                </div>
              </div>
            </div>
          </BlurReveal>
        </div>
      </div>
    </section>
  );
}
