'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlurReveal, CountUp } from '@/components/motion';
import { useCursorState } from '@/providers/CursorProvider';
import { ArrowRight, Globe, Smartphone, ShieldCheck, Sparkles } from 'lucide-react';

const STATS = [
  { value: 47,  suffix: '+',  label: 'Delivered Projects' },
  { value: 98,  suffix: '%',  label: 'Client Retention' },
  { value: 99,  suffix: '',   label: 'Lighthouse Performance' },
];

const ROTATING_SPECIALTIES = [
  'Web Engineering',
  'Mobile Applications',
  'SaaS Platforms',
  'Cloud Systems',
];

const CAPABILITY_PILLS = [
  { icon: Globe, label: 'Web Platforms', desc: 'Next.js 15 & React 19' },
  { icon: Smartphone, label: 'Mobile Software', desc: 'Native Android Apps' },
  { icon: ShieldCheck, label: 'Edge Systems', desc: 'Sub-50ms Latency' },
];

export function SceneArrival() {
  const { setState } = useCursorState();
  const [currentWordIdx, setCurrentWordIdx] = useState(0);

  // Rotate specialty headline every 2.6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentWordIdx((prev) => (prev + 1) % ROTATING_SPECIALTIES.length);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="scene-arrival"
      data-scene="arrival"
      className="relative min-h-[88dvh] flex items-center justify-center overflow-hidden pt-24 pb-16"
      aria-label="Hero — Devzite Studio"
    >
      {/* Refined ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(59,130,246,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      {/* ── Hero Content (Balanced Sizing) ── */}
      <div className="container-site relative z-10 text-center flex flex-col items-center max-w-5xl">

        {/* Top Status Indicator */}
        <BlurReveal delay={0.1}>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs font-mono text-[#0F172A] dark:text-[#CBD5E1] tracking-wide font-semibold">
              Available for Q3/Q4 Projects
            </span>
          </div>
        </BlurReveal>

        {/* Main headline — High-impact, bold & prominent font weight */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black mb-6 tracking-tight max-w-5xl mx-auto leading-[1.08] text-[#0F172A] dark:text-[#F8FAFC]">
          High-Impact Software &{' '}
          <span className="inline-flex items-center text-[#3B82F6] font-black">
            <AnimatePresence mode="wait">
              <motion.span
                key={ROTATING_SPECIALTIES[currentWordIdx]}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
              >
                {ROTATING_SPECIALTIES[currentWordIdx]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        {/* Sub-headline description — High contrast in Light and Dark Mode */}
        <BlurReveal delay={0.35}>
          <p className="text-lg sm:text-xl lg:text-2xl text-[#334155] dark:text-[#CBD5E1] max-w-3xl mx-auto mb-10 leading-relaxed font-body font-semibold">
            Devzite is a digital engineering studio. We build high-performance web applications, native mobile software, and custom cloud products for ambitious brands.
          </p>
        </BlurReveal>

        {/* Action CTAs */}
        <BlurReveal delay={0.5}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <a
              href="#scene-problems"
              id="hero-cta-work"
              onMouseEnter={() => setState('hover-button')}
              onMouseLeave={() => setState('idle')}
              className="btn-primary text-sm sm:text-base px-7 py-3.5 shadow-[0_0_25px_rgba(59,130,246,0.2)]"
            >
              Explore Capabilities
              <ArrowRight size={16} />
            </a>
            <a
              href="#scene-invitation"
              id="hero-cta-project"
              onMouseEnter={() => setState('hover-button')}
              onMouseLeave={() => setState('idle')}
              className="btn-ghost text-sm sm:text-base px-7 py-3.5"
            >
              Start a Project
            </a>
          </div>
        </BlurReveal>

        {/* Capability Cards Row (3 Cards) */}
        <BlurReveal delay={0.65} className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] pt-8">
            {CAPABILITY_PILLS.map((cap) => {
              const IconComp = cap.icon;
              return (
                <div key={cap.label} className="glass-card rounded-xl p-4 text-left flex items-center gap-3.5 border border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)] hover:border-[rgba(59,130,246,0.3)] transition-all">
                  <div className="w-9 h-9 rounded-lg bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] flex items-center justify-center text-[#3B82F6] shrink-0">
                    <IconComp size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-display font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                      {cap.label}
                    </div>
                    <div className="text-xs font-mono text-[#475569] dark:text-[#94A3B8] font-medium">
                      {cap.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </BlurReveal>

        {/* Stat Highlights */}
        <BlurReveal delay={0.8} className="w-full">
          <div className="mt-8 grid grid-cols-3 gap-4 w-full pt-4">
            {STATS.map(({ value, suffix, label }) => (
              <div key={label} className="text-center p-3">
                <div className="text-2xl sm:text-3xl font-display font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-0.5">
                  <CountUp end={value} suffix={suffix} duration={2.0} />
                </div>
                <div className="text-[11px] text-[#475569] dark:text-[#64748B] font-mono uppercase tracking-wider font-semibold">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </BlurReveal>

      </div>
    </section>
  );
}
