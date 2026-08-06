'use client';

import { BlurReveal, WordReveal, CountUp, GlassCard, FadeUp } from '@/components/motion';

const FEATURE_CARDS = [
  {
    icon: '⚡',
    title: 'Lightning Fast',
    desc: 'Sub-second LCP and near-zero CLS optimization on every single build.',
    stat: '95+',
    statLabel: 'Lighthouse Score',
    accent: '#3B82F6',
  },
  {
    icon: '🔒',
    title: 'Enterprise Security',
    desc: 'Role-based authentication, Zod schema validation, and end-to-end data encryption.',
    stat: '256-bit',
    statLabel: 'Encryption',
    accent: '#06B6D4',
  },
  {
    icon: '🤖',
    title: 'AI Powered',
    desc: 'Automated content pipelines, LLM integrations, and AI video production workflows.',
    stat: '7-step',
    statLabel: 'AI Engine',
    accent: '#8B5CF6',
  },
  {
    icon: '📱',
    title: 'Mobile Native',
    desc: 'Clean Android architecture with reactive UI, smooth transitions, and offline support.',
    stat: 'AAA',
    statLabel: 'Accessibility',
    accent: '#10B981',
  },
];

export function SceneNumbers() {
  return (
    <section
      id="scene-numbers"
      data-scene="numbers"
      className="section-padding relative overflow-hidden"
      aria-label="Why choose Devzite"
    >
      <div className="container-site">
        <BlurReveal>
          <span className="text-xs font-mono text-[#06B6D4] uppercase tracking-widest font-semibold">
            / 04 — Why Choose Devzite
          </span>
        </BlurReveal>

        <h2 className="text-display-md font-display font-black text-[#F8FAFC] mt-4 mb-16 max-w-3xl">
          <WordReveal text="Engineered for scale," delay={0.15} stagger={0.04} className="block mb-1" />
          <WordReveal text="security, & speed." delay={0.3} stagger={0.04} className="block gradient-text-cyan" wordClassName="gradient-text-cyan" />
        </h2>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">

          {/* ── Card 1: Edge Infrastructure (2 col span) ── */}
          <BlurReveal className="md:col-span-2 lg:col-span-2" delay={0.15}>
            <div className="rounded-2xl glass-card h-full p-8 relative overflow-hidden group flex flex-col justify-between border border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.3)]">
              <div>
                <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-wider block mb-2 font-semibold">
                  ☁️ Global Edge Infrastructure
                </span>
                <h3 className="font-display font-bold text-2xl text-[#F8FAFC] mb-3">
                  Cloud Native Edge Deployments
                </h3>
                <p className="text-sm text-[#CBD5E1] leading-relaxed max-w-md font-body">
                  Sub-50ms latency worldwide via Vercel Edge & Cloudflare global distribution nodes. Instant cold starts, automated SSL, and DDoS resilience built in.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                <span className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider font-semibold">Distribution</span>
                <span className="text-sm font-display font-bold text-[#3B82F6]">300+ Edge Nodes</span>
              </div>
            </div>
          </BlurReveal>

          {/* ── Feature cards ── */}
          {FEATURE_CARDS.map((card, i) => (
            <GlassCard key={card.title} delay={0.25 + i * 0.08} className="rounded-2xl p-7 group relative overflow-hidden flex flex-col justify-between">
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 0% 0%, ${card.accent}12 0%, transparent 60%)` }}
              />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `${card.accent}18`,
                      border: `1px solid ${card.accent}30`,
                      boxShadow: `0 0 20px ${card.accent}20`,
                    }}
                  >
                    {card.icon}
                  </div>
                  <h3 className="font-display font-bold text-[#F8FAFC] text-xl mb-2">{card.title}</h3>
                  <p className="text-sm text-[#CBD5E1] leading-relaxed mb-6 font-body">{card.desc}</p>
                </div>
                <div
                  className="pt-4 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between"
                >
                  <span className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider font-semibold">{card.statLabel}</span>
                  <span className="text-base font-display font-bold" style={{ color: card.accent }}>{card.stat}</span>
                </div>
              </div>
            </GlassCard>
          ))}

          {/* ── Track Record mega card (span 3 on lg) ── */}
          <BlurReveal className="md:col-span-3 lg:col-span-3" delay={0.6}>
            <div className="rounded-2xl glass-card p-8 relative overflow-hidden border-l-4 border-[#3B82F6]">
              <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div>
                  <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-wider block mb-2 font-semibold">
                    🚀 Track Record
                  </span>
                  <h3 className="font-display font-bold text-2xl text-[#F8FAFC] max-w-sm">
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
                      <div className="text-4xl sm:text-5xl font-display font-black gradient-text mb-1">
                        <CountUp end={end} suffix={suffix} duration={2.4} />
                      </div>
                      <div className="text-xs font-mono text-[#94A3B8] uppercase tracking-widest font-semibold">
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
              className="rounded-2xl glass-card p-8 h-full flex flex-col items-center justify-center text-center relative overflow-hidden"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.08) 0%, transparent 70%)' }}
            >
              <div className="text-6xl font-display font-black mb-1 gradient-text">99</div>
              <div className="text-xs font-mono text-[#10B981] uppercase tracking-widest mb-2 font-semibold">Lighthouse</div>
              <p className="text-xs text-[#94A3B8] leading-relaxed font-body">Average score across all delivered projects</p>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
