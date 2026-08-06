'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal, TextReveal, CountUp } from '@/components/motion';

const BASE_PRICES: Record<string, { base: number; weeks: number; stack: string[] }> = {
  website: { base: 6500, weeks: 3, stack: ['Next.js 15', 'GSAP', 'Lenis', 'Tailwind'] },
  'web-apps': { base: 12000, weeks: 6, stack: ['React 19', 'TypeScript', 'Firebase', 'Zod'] },
  'android-apps': { base: 9500, weeks: 5, stack: ['Android Native', 'Kotlin', 'Firebase'] },
  'ai-videos': { base: 4500, weeks: 2, stack: ['Script AI', 'Voice Synth', 'Render Engine'] },
};

export default function PricingPage() {
  const [service, setService] = useState<'website' | 'web-apps' | 'android-apps' | 'ai-videos'>('website');
  const [tier, setTier] = useState<number>(2); // 1: Starter, 2: Growth, 3: Enterprise

  const tierMultiplier = tier === 1 ? 1 : tier === 2 ? 1.6 : 2.5;
  const currentConfig = BASE_PRICES[service];
  const calculatedPrice = Math.round(currentConfig.base * tierMultiplier);
  const calculatedWeeks = Math.round(currentConfig.weeks * (tier === 1 ? 1 : tier === 2 ? 1.3 : 1.8));

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen">
        <div className="container-site">
          {/* Header */}
          <div className="max-w-3xl mb-16 text-center mx-auto">
            <BlurReveal>
              <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest">
                / Interactive Configurator
              </span>
            </BlurReveal>

            <TextReveal
              text="Transparent pricing for high-impact software."
              className="text-display-lg font-display font-black text-[#F8FAFC] mt-4 mb-4"
              delay={0.2}
            />

            <BlurReveal delay={0.35}>
              <p className="text-base text-[#94A3B8] leading-relaxed">
                Configure your project requirements below to see an instant estimate for investment, timeline, and included tech stack.
              </p>
            </BlurReveal>
          </div>

          {/* Configurator Box */}
          <BlurReveal delay={0.4}>
            <div className="max-w-4xl mx-auto rounded-3xl glass p-8 sm:p-12 border border-[rgba(255,255,255,0.08)] shadow-2xl relative">
              {/* Service Toggle Pills */}
              <div className="mb-10">
                <label className="text-xs font-mono text-[#64748B] uppercase tracking-wider block mb-3">
                  Step 1: Select Service Domain
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'website', label: '🌐 Website' },
                    { id: 'web-apps', label: '⚙️ SaaS App' },
                    { id: 'android-apps', label: '📱 Android' },
                    { id: 'ai-videos', label: '🎬 AI Video' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setService(s.id as any)}
                      className={`py-3 px-4 rounded-xl text-xs font-mono transition-all duration-200 ${
                        service === s.id
                          ? 'bg-[#3B82F6] text-white shadow-lg font-bold'
                          : 'glass text-[#94A3B8] hover:text-[#F8FAFC]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Complexity Tier Slider */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-mono text-[#64748B] uppercase tracking-wider">
                    Step 2: Complexity & Scale Tier
                  </label>
                  <span className="text-xs font-mono text-[#06B6D4] font-bold">
                    {tier === 1 ? 'Starter MVP' : tier === 2 ? 'Growth & Scaling' : 'Enterprise Scale'}
                  </span>
                </div>

                <input
                  type="range"
                  min={1}
                  max={3}
                  step={1}
                  value={tier}
                  onChange={(e) => setTier(Number(e.target.value))}
                  className="w-full h-2 bg-[rgba(255,255,255,0.1)] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                />

                <div className="flex justify-between text-[11px] font-mono text-[#64748B] mt-2">
                  <span>Tier 1 (MVP)</span>
                  <span>Tier 2 (Growth)</span>
                  <span>Tier 3 (Enterprise)</span>
                </div>
              </div>

              {/* Live Calculation Output Card */}
              <div className="p-8 rounded-2xl bg-[rgba(0,0,0,0.4)] border border-[rgba(59,130,246,0.3)] grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div>
                  <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider block mb-1">
                    Estimated Investment
                  </span>
                  <div className="text-4xl font-display font-black gradient-text">
                    $<CountUp end={calculatedPrice} duration={1} />
                  </div>
                  <span className="text-[10px] font-mono text-[#64748B]">Fixed-scope milestone contract</span>
                </div>

                <div>
                  <span className="text-xs font-mono text-[#64748B] uppercase tracking-wider block mb-1">
                    Estimated Timeline
                  </span>
                  <div className="text-3xl font-display font-black text-[#F8FAFC]">
                    ~{calculatedWeeks} Weeks
                  </div>
                  <span className="text-[10px] font-mono text-[#64748B]">Weekly sprint updates</span>
                </div>

                <div className="text-right">
                  <Link
                    href={`/contact?service=${service}&tier=${tier}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-xs transition-all shadow-xl"
                  >
                    Lock In This Quote →
                  </Link>
                </div>
              </div>

              {/* Included Stack Badges */}
              <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                <span className="text-xs font-mono text-[#64748B]">Included Technologies:</span>
                <div className="flex flex-wrap gap-2">
                  {currentConfig.stack.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-full text-[11px] font-mono glass text-[#94A3B8]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </BlurReveal>
        </div>
      </main>

      <Footer />
    </>
  );
}
