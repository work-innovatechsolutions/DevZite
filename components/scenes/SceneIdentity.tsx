'use client';

import { BlurReveal, WordReveal, GlassCard } from '@/components/motion';
import { Target, Zap, ShieldCheck } from 'lucide-react';

const PRINCIPLES = [
  {
    icon: Target,
    title: 'Purpose-Driven Architecture',
    desc: 'Every technical choice and UI interaction serves clear business objectives and user utility.',
    accent: '#3B82F6',
  },
  {
    icon: Zap,
    title: 'Performance Optimization',
    desc: 'Sub-second page loads, minimal JavaScript payloads, and zero layout shifts on every build.',
    accent: '#06B6D4',
  },
  {
    icon: ShieldCheck,
    title: 'Production-Grade Quality',
    desc: 'Strict TypeScript schemas, automated error boundaries, and scalable cloud edge infrastructure.',
    accent: '#8B5CF6',
  },
];

const HIGHLIGHTS = [
  { metric: '99%', label: 'Lighthouse Performance Score' },
  { metric: '< 50ms', label: 'Global Edge Network Latency' },
  { metric: '100%', label: 'Clean Type Safety & Tests' },
  { metric: '24 / 7', label: 'Continuous Telemetry Monitoring' },
];

export function SceneIdentity() {
  return (
    <section
      id="scene-identity"
      data-scene="identity"
      className="section-padding relative overflow-hidden"
      aria-label="Engineering Philosophy"
    >
      <div className="container-site relative z-10">

        {/* ── Full-Width Centered Header ── */}
        <div className="text-center max-w-4xl mx-auto mb-4">
          <BlurReveal>
            <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest font-semibold block mb-2">
              / 01 — Studio Philosophy
            </span>
          </BlurReveal>

          <BlurReveal delay={0.15}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC] mb-3 leading-tight">
              Engineered for speed.{' '}
              <span className="text-[#3B82F6] inline-block">Built for stability.</span>
            </h2>
          </BlurReveal>

          <BlurReveal delay={0.3}>
            <p className="text-base sm:text-lg lg:text-xl text-[#0F172A] dark:text-[#CBD5E1] leading-relaxed max-w-3xl mx-auto font-body font-semibold">
              We believe exceptional software balances visual elegance with uncompromising technical performance. Every product we build is structured with modular component architecture, robust type safety, and global CDN edge delivery.
            </p>
          </BlurReveal>
        </div>

        {/* ── Full-Width 4-Metric Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 w-full">
          {HIGHLIGHTS.map((h, i) => (
            <BlurReveal key={h.label} delay={0.2 + i * 0.1}>
              <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-full border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.35)] transition-all">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-display font-black metric-value mb-3">
                  {h.metric}
                </div>
                <p className="text-xs sm:text-sm metric-label font-body leading-snug font-bold">
                  {h.label}
                </p>
              </div>
            </BlurReveal>
          ))}
        </div>

        {/* ── Full-Width 3-Column Principles Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {PRINCIPLES.map((p, i) => {
            const IconComp = p.icon;
            return (
              <GlassCard key={p.title} delay={0.5 + i * 0.1} className="rounded-2xl p-8 group border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.35)]">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${p.accent}18`, border: `1px solid ${p.accent}30` }}
                >
                  <IconComp size={24} style={{ color: p.accent }} />
                </div>
                <h3 className="font-display font-extrabold text-[#0F172A] dark:text-[#F8FAFC] text-xl mb-3">
                  {p.title}
                </h3>
                <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed font-body">
                  {p.desc}
                </p>
              </GlassCard>
            );
          })}
        </div>

      </div>
    </section>
  );
}
