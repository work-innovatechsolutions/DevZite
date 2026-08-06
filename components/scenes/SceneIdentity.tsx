'use client';

import dynamic from 'next/dynamic';
import { BlurReveal, WordReveal, GradientText, GlassCard } from '@/components/motion';

const LiquidOrb = dynamic(() => import('@/components/three/LiquidOrb'), {
  ssr: false,
  loading: () => <div className="w-full h-[320px]" />,
});

const PRINCIPLES = [
  {
    icon: '🎯',
    title: 'Purpose First',
    desc: 'Animation serves communication, not clutter.',
    accent: '#3B82F6',
  },
  {
    icon: '⚡',
    title: 'Speed is Feature',
    desc: 'Performance is never sacrificed for visuals.',
    accent: '#06B6D4',
  },
  {
    icon: '✦',
    title: 'Details are Design',
    desc: 'Hidden touches build long-term memorability.',
    accent: '#8B5CF6',
  },
];

export function SceneIdentity() {
  return (
    <section
      id="scene-identity"
      data-scene="identity"
      className="section-padding relative overflow-hidden"
      aria-label="Identity and Brand Manifesto"
    >
      {/* Subtle section separator glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(59,130,246,0.4), transparent)' }}
      />

      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* ── Left: Manifesto ── */}
          <div className="lg:col-span-7">
            <BlurReveal>
              <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest">
                / 01 — Identity
              </span>
            </BlurReveal>

            {/* Word-by-word stagger reveal manifesto */}
            <h2 className="text-display-lg font-display font-black mt-5 mb-3 leading-[0.95]">
              <WordReveal
                text="We don't build websites."
                className="block text-[#F8FAFC]"
                delay={0.15}
                stagger={0.05}
              />
              <WordReveal
                text="We engineer"
                className="block"
                wordClassName="gradient-text"
                delay={0.4}
                stagger={0.05}
              />
              <WordReveal
                text="digital experiences."
                className="block"
                wordClassName="gradient-text"
                delay={0.55}
                stagger={0.05}
              />
            </h2>

            <BlurReveal delay={0.65}>
              <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed mb-8 max-w-2xl">
                Not everything that loads fast looks good. Not everything that looks good loads fast.{' '}
                <GradientText from="#60A5FA" to="#8B5CF6">We refuse to choose.</GradientText>{' '}
                Every project we craft is engineered like a living operating system — visually striking, accessible, and blindingly fast.
              </p>
            </BlurReveal>

            {/* Brand manifesto quote */}
            <BlurReveal delay={0.78}>
              <blockquote className="glass-card rounded-2xl p-7 border-l-2 border-[#3B82F6] mb-10 relative overflow-hidden">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 0% 50%, rgba(59,130,246,0.06) 0%, transparent 60%)' }}
                />
                <p className="text-base text-[#E2E8F0] italic leading-relaxed relative z-10">
                  &ldquo;We craft digital worlds. We build as if every pixel is a promise to someone.&rdquo;
                </p>
                <span className="text-xs font-mono text-[#3B82F6] mt-3 block relative z-10">
                  — Innovatech Solutions Brand Manifesto
                </span>
              </blockquote>
            </BlurReveal>

            {/* Principle cards with glow tints */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PRINCIPLES.map((p, i) => (
                <GlassCard key={p.title} variant="shimmer" delay={0.9 + i * 0.1}
                  className="rounded-2xl p-5 group"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-lg mb-3 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${p.accent}18`, border: `1px solid ${p.accent}30` }}
                  >
                    {p.icon}
                  </div>
                  <h3
                    className="font-display font-bold text-[#F8FAFC] text-sm mb-1"
                    style={{ color: undefined }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{p.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* ── Right: LiquidOrb 3D ── */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <BlurReveal delay={0.3} className="w-full flex justify-center">
              <div className="relative">
                {/* Glow halo behind orb */}
                <div
                  className="absolute inset-0 -m-8 rounded-full pointer-events-none animate-pulse-glow"
                  style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
                />
                <LiquidOrb />
              </div>
            </BlurReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
