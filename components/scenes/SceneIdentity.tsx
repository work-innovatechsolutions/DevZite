'use client';

import dynamic from 'next/dynamic';
import { BlurReveal, TextReveal, GradientText } from '@/components/motion';

const LiquidOrb = dynamic(() => import('@/components/three/LiquidOrb'), {
  ssr: false,
  loading: () => <div className="w-full h-[300px]" />,
});

export function SceneIdentity() {
  return (
    <section
      id="scene-identity"
      data-scene="identity"
      className="section-padding relative overflow-hidden"
      aria-label="Identity and Manifesto"
    >
      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Manifesto */}
          <div className="lg:col-span-7">
            <BlurReveal>
              <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest">
                / 01 — Identity
              </span>
            </BlurReveal>

            <TextReveal
              text="We don't build websites."
              className="text-display-lg font-display font-black text-[#F8FAFC] mt-4 mb-2 leading-none"
              delay={0.2}
              stagger={0.04}
            />
            <TextReveal
              text="We engineer digital experiences."
              className="text-display-lg font-display font-black gradient-text mb-6 leading-none"
              delay={0.4}
              stagger={0.04}
            />

            <BlurReveal delay={0.55}>
              <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed mb-6">
                Not everything that loads fast looks good. Not everything that looks good loads fast.{' '}
                <GradientText>We refuse to choose.</GradientText> Every project we craft is engineered like a living operating system — visually striking, accessible, and blindingly fast.
              </p>
            </BlurReveal>

            <BlurReveal delay={0.65}>
              <div className="p-6 rounded-2xl glass border border-[rgba(255,255,255,0.08)] mb-8 bg-[rgba(59,130,246,0.02)]">
                <p className="text-sm text-[#F8FAFC] italic font-serif leading-relaxed">
                  &ldquo;We craft digital worlds. We build as if every pixel is a promise to someone.&rdquo;
                </p>
                <span className="text-xs font-mono text-[#3B82F6] mt-3 block">
                  — Innovatech Solutions Brand Manifesto
                </span>
              </div>
            </BlurReveal>

            {/* Principles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: '🎯', title: 'Purpose First', desc: 'Animation serves communication, not clutter.' },
                { icon: '⚡', title: 'Speed is Feature', desc: 'Performance is never sacrificed for visuals.' },
                { icon: '✦', title: 'Details are Design', desc: 'Hidden touches build long-term memorability.' },
              ].map((p, i) => (
                <BlurReveal key={p.title} delay={0.75 + i * 0.08}>
                  <div className="glass rounded-xl p-5 hover:border-[rgba(59,130,246,0.3)] transition-all duration-300">
                    <span className="text-2xl mb-2 block">{p.icon}</span>
                    <h3 className="font-display font-bold text-[#F8FAFC] text-sm mb-1">{p.title}</h3>
                    <p className="text-xs text-[#64748B] leading-normal">{p.desc}</p>
                  </div>
                </BlurReveal>
              ))}
            </div>
          </div>

          {/* Right LiquidOrb 3D canvas */}
          <div className="lg:col-span-5 flex justify-center">
            <BlurReveal delay={0.4}>
              <LiquidOrb />
            </BlurReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
