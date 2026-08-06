'use client';

import { BlurReveal, WordReveal, CountUp } from '@/components/motion';
import { motion } from 'framer-motion';
import { DURATION, EASE } from '@/lib/motion/tokens';

const STATS = [
  {
    end: 47,
    suffix: '+',
    label: 'Projects Delivered',
    desc: 'From MVPs to enterprise-scale platforms',
    accent: '#3B82F6',
    glow: 'rgba(59,130,246,0.2)',
    icon: '🚀',
  },
  {
    end: 98,
    suffix: '%',
    label: 'Client Retention',
    desc: 'Clients who return for their next project',
    accent: '#06B6D4',
    glow: 'rgba(6,182,212,0.15)',
    icon: '♻️',
  },
  {
    end: 12,
    suffix: '',
    label: 'Countries Served',
    desc: 'Global brands across 4 continents',
    accent: '#8B5CF6',
    glow: 'rgba(139,92,246,0.15)',
    icon: '🌍',
  },
  {
    end: 99,
    suffix: '',
    label: 'Lighthouse Score',
    desc: 'Avg. performance score across all projects',
    accent: '#10B981',
    glow: 'rgba(16,185,129,0.12)',
    icon: '⚡',
  },
  {
    end: 3,
    suffix: 'yrs',
    label: 'Years of Craft',
    desc: 'Shipping pixel-perfect digital products',
    accent: '#F59E0B',
    glow: 'rgba(245,158,11,0.12)',
    icon: '🏆',
  },
];

export function SceneStatistics() {
  return (
    <section
      id="scene-statistics"
      data-scene="statistics"
      className="section-padding relative overflow-hidden"
      aria-label="Key statistics"
    >
      {/* Background accent stripe */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 60% at 50% 50%, rgba(59,130,246,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="container-site relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <BlurReveal>
            <span className="text-xs font-mono text-[#F59E0B] uppercase tracking-widest">
              / 06 — By The Numbers
            </span>
          </BlurReveal>
          <h2 className="text-display-md font-display font-black text-[#F8FAFC] mt-4">
            <WordReveal text="Proof in" delay={0.15} stagger={0.06} className="inline" />
            {' '}
            <WordReveal
              text="every metric."
              delay={0.3}
              stagger={0.06}
              className="inline gradient-text"
              wordClassName="gradient-text"
            />
          </h2>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: DURATION.slow, delay: i * 0.1, ease: EASE.premium }}
              className="group"
            >
              <div
                className="glass-card rounded-2xl p-7 text-center relative overflow-hidden h-full flex flex-col items-center"
              >
                {/* Radial glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 50%, ${stat.glow} 0%, transparent 65%)` }}
                />
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-3/4 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: `linear-gradient(90deg, transparent, ${stat.accent}, transparent)` }}
                />

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110 relative z-10"
                  style={{
                    background: `${stat.accent}14`,
                    border: `1px solid ${stat.accent}30`,
                    boxShadow: `0 0 24px ${stat.accent}20`,
                  }}
                >
                  {stat.icon}
                </div>

                {/* Counter */}
                <div
                  className="text-5xl sm:text-6xl font-display font-black mb-2 tabular-nums relative z-10"
                  style={{ color: stat.accent }}
                >
                  <CountUp end={stat.end} suffix={stat.suffix} duration={2.6} />
                </div>

                {/* Label */}
                <h3 className="font-display font-bold text-[#F8FAFC] text-sm mb-2 relative z-10">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-[11px] text-[#64748B] leading-relaxed relative z-10">
                  {stat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
