'use client';

import dynamic from 'next/dynamic';
import { BlurReveal, WordReveal, CountUp, GlassCard, FadeUp } from '@/components/motion';

const CobeGlobe = dynamic(() => import('@/components/three/CobeGlobe'), {
  ssr: false,
  loading: () => <div className="w-[300px] h-[300px]" />,
});

const FEATURE_CARDS = [
  {
    icon: '⚡',
    title: 'Lightning Fast',
    desc: 'Sub-second LCP and near-zero CLS on every build.',
    stat: '95+',
    statLabel: 'Lighthouse',
    accent: '#3B82F6',
    span: '',
  },
  {
    icon: '🔒',
    title: 'Enterprise Security',
    desc: 'Role-based Firebase Auth, Zod validation, and end-to-end encryption.',
    stat: '256-bit',
    statLabel: 'Encryption',
    accent: '#06B6D4',
    span: '',
  },
  {
    icon: '🤖',
    title: 'AI Powered',
    desc: 'Automated pipelines, LLM integrations, and AI video production.',
    stat: '7-step',
    statLabel: 'AI Pipeline',
    accent: '#8B5CF6',
    span: '',
  },
  {
    icon: '📱',
    title: 'Mobile Native',
    desc: 'Clean Android architecture with reactive UI and offline support.',
    stat: 'AAA',
    statLabel: 'Accessibility',
    accent: '#10B981',
    span: '',
  },
];

export function SceneNumbers() {
  return (
    <section
      id="scene-numbers"
      data-scene="numbers"
      className="section-padding relative overflow-hidden"
      aria-label="Why choose Innovatech Solutions"
    >
      <div className="container-site">
        <BlurReveal>
          <span className="text-xs font-mono text-[#06B6D4] uppercase tracking-widest">
            / 04 — Why Choose Innovatech
          </span>
        </BlurReveal>

        <h2 className="text-display-md font-display font-black text-[#F8FAFC] mt-4 mb-14 max-w-3xl">
          <WordReveal text="Engineered for scale," delay={0.15} stagger={0.04} className="block" />
          <WordReveal text="security, & speed." delay={0.3} stagger={0.04} className="block gradient-text-cyan" wordClassName="gradient-text-cyan" />
        </h2>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">

          {/* ── Card 1: Globe (2 col span) ── */}
          <BlurReveal className="md:col-span-2 lg:col-span-2" delay={0.15}>
            <div className="rounded-2xl glass-card h-full p-8 relative overflow-hidden group">
              {/* Glow behind globe */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-40 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, transparent 70%)' }}
              />
              <div className="relative z-10">
                <span className="text-[11px] font-mono text-[#3B82F6] uppercase tracking-wider block mb-1">
                  ☁️ Global Edge Infrastructure
                </span>
                <h3 className="font-display font-bold text-xl text-[#F8FAFC] mb-1">
                  Cloud Native Deployments
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed max-w-xs">
                  Sub-50ms latency worldwide via Vercel Edge & Cloudflare global nodes.
                </p>
              </div>
              <div className="flex justify-center mt-2 relative z-10">
                <CobeGlobe />
              </div>
            </div>
          </BlurReveal>

          {/* ── Feature cards (4 small) ── */}
          {FEATURE_CARDS.map((card, i) => (
            <GlassCard key={card.title} delay={0.25 + i * 0.08} className="rounded-2xl p-6 group relative overflow-hidden">
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 0% 0%, ${card.accent}12 0%, transparent 60%)` }}
              />
              <div className="relative z-10 flex flex-col h-full">
                {/* Icon with animated pulse glow */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4 transition-transform duration-300 group-hover:scale-110 animate-breathe"
                  style={{
                    background: `${card.accent}15`,
                    border: `1px solid ${card.accent}30`,
                    boxShadow: `0 0 20px ${card.accent}20`,
                  }}
                >
                  {card.icon}
                </div>
                <h3 className="font-display font-bold text-[#F8FAFC] text-base mb-1">{card.title}</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed flex-1 mb-4">{card.desc}</p>
                <div
                  className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between"
                >
                  <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider">{card.statLabel}</span>
                  <span className="text-sm font-display font-bold" style={{ color: card.accent }}>{card.stat}</span>
                </div>
              </div>
            </GlassCard>
          ))}

          {/* ── Track Record mega card (span 3 on lg) ── */}
          <BlurReveal className="md:col-span-3 lg:col-span-3" delay={0.6}>
            <div className="rounded-2xl glass-card p-8 relative overflow-hidden border-l-2 border-[#3B82F6]">
              {/* Background pulse glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 0% 50%, rgba(59,130,246,0.06) 0%, transparent 60%)' }}
              />
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div>
                  <span className="text-[11px] font-mono text-[#3B82F6] uppercase tracking-wider block mb-2">
                    🚀 Track Record
                  </span>
                  <h3 className="font-display font-bold text-xl text-[#F8FAFC] max-w-xs">
                    Trusted by ambitious startups & fast-growing digital brands
                  </h3>
                </div>
                <div className="flex items-center gap-10 shrink-0">
                  {[
                    { end: 47, suffix: '+', label: 'Launches' },
                    { end: 100, suffix: '%', label: 'On-Time' },
                    { end: 12, suffix: '', label: 'Countries' },
                  ].map(({ end, suffix, label }) => (
                    <div key={label} className="text-center">
                      <div className="text-3xl sm:text-4xl font-display font-black gradient-text">
                        <CountUp end={end} suffix={suffix} duration={2.4} />
                      </div>
                      <div className="text-[10px] font-mono text-[#64748B] uppercase tracking-widest mt-1">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BlurReveal>

          {/* ── Lighthouse badge card ── */}
          <FadeUp delay={0.65} className="lg:col-span-1">
            <div
              className="rounded-2xl glass-card p-6 h-full flex flex-col items-center justify-center text-center relative overflow-hidden"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.06) 0%, transparent 70%)' }}
            >
              <div className="text-5xl font-display font-black mb-1 gradient-text">99</div>
              <div className="text-xs font-mono text-[#10B981] uppercase tracking-widest mb-2">Lighthouse</div>
              <p className="text-[11px] text-[#64748B] leading-relaxed">Average score across all delivered projects</p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
