'use client';

import dynamic from 'next/dynamic';
import { BlurReveal, TextReveal, CountUp } from '@/components/motion';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useCursorState } from '@/providers/CursorProvider';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
});

export function SceneArrival() {
  const mousePos = useMousePosition() || { x: 0, y: 0, nx: 0, ny: 0 };
  const { setState } = useCursorState();

  return (
    <section
      id="scene-arrival"
      data-scene="arrival"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20"
      aria-label="Hero section"
    >
      {/* 3D Background Canvas */}
      <div className="absolute inset-0 z-0">
        <HeroScene mousePos={{ x: mousePos.nx, y: mousePos.ny }} />
      </div>

      {/* Radial Glow Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 45%, rgba(59,130,246,0.1) 0%, transparent 70%)',
        }}
      />

      <div className="container-site relative z-10 text-center py-12">
        {/* Eyebrow badge */}
        <BlurReveal delay={0.2}>
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass border border-[rgba(255,255,255,0.08)] mb-8 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse" />
            <span className="text-xs font-mono text-[#94A3B8] uppercase tracking-widest">
              Digital Agency Operating System
            </span>
          </div>
        </BlurReveal>

        {/* Main Headline */}
        <h1 className="text-display-xl font-display font-black mb-6 tracking-tight">
          <TextReveal
            text="We Build Digital"
            className="block text-[#F8FAFC]"
            delay={0.3}
          />
          <TextReveal
            text="Experiences That"
            className="block"
            wordClassName="gradient-text"
            delay={0.45}
          />
          <TextReveal
            text="People Remember."
            className="block text-[#F8FAFC]"
            delay={0.60}
          />
        </h1>

        {/* Sub-headline */}
        <BlurReveal delay={0.75}>
          <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed font-body">
            We craft cinematic websites, web apps, native Android experiences, AI videos, and content platforms designed to position your brand on another level.
          </p>
        </BlurReveal>

        {/* CTAs */}
        <BlurReveal delay={0.9}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#scene-proof"
              onMouseEnter={() => setState('hover-button')}
              onMouseLeave={() => setState('idle')}
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-body font-semibold text-base transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-95"
            >
              See Our Work
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </a>
            <a
              href="#scene-invitation"
              onMouseEnter={() => setState('hover-button')}
              onMouseLeave={() => setState('idle')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass hover:border-[rgba(59,130,246,0.3)] text-[#F8FAFC] font-body font-semibold text-base transition-all duration-300 hover:text-[#60A5FA]"
            >
              Start a Project
            </a>
          </div>
        </BlurReveal>

        {/* Live Counters */}
        <BlurReveal delay={1.05}>
          <div className="mt-16 sm:mt-20 grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto border-t border-[rgba(255,255,255,0.06)] pt-8">
            {[
              { value: 47, suffix: '+', label: 'Projects' },
              { value: 98, suffix: '%', label: 'Retention' },
              { value: 24, suffix: '/7', label: 'Support' },
            ].map(({ value, suffix, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-display font-black gradient-text">
                  <CountUp end={value} suffix={suffix} duration={2} />
                </div>
                <div className="text-[11px] text-[#64748B] font-body mt-1 uppercase tracking-widest">
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
