'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BlurReveal, WordReveal } from '@/components/motion';
import { useCursorState } from '@/providers/CursorProvider';
import { DURATION, EASE } from '@/lib/motion/tokens';

const SERVICES_DATA = [
  {
    slug: 'website',
    problem: '"Our current website looks generic and fails to convert visitors."',
    solution: 'Cinematic Websites',
    description: 'Next.js 15, GSAP & R3F digital experiences that position your brand ahead of competitors.',
    icon: '🌐',
    tag: 'Web Design',
    accent: '#3B82F6',
    glow: 'rgba(59,130,246,0.15)',
  },
  {
    slug: 'web-apps',
    problem: '"We need a complex SaaS app that feels instant and handles heavy workloads."',
    solution: 'Web Applications',
    description: 'Full-stack platforms built with React 19, TypeScript, and Firebase serverless scale.',
    icon: '⚙️',
    tag: 'SaaS Platforms',
    accent: '#06B6D4',
    glow: 'rgba(6,182,212,0.12)',
  },
  {
    slug: 'android-apps',
    problem: '"We want native Android users with fluid animations and offline capabilities."',
    solution: 'Android Applications',
    description: 'High-performance mobile apps built with clean architecture and reactive UI.',
    icon: '📱',
    tag: 'Mobile Apps',
    accent: '#8B5CF6',
    glow: 'rgba(139,92,246,0.12)',
  },
  {
    slug: 'ai-videos',
    problem: '"Our video content is expensive, slow to produce, and lacks cinematic polish."',
    solution: 'AI Video Production',
    description: '7-step automated AI video pipelines for product launches, brand reels, and ads.',
    icon: '🎬',
    tag: 'AI Content',
    accent: '#F59E0B',
    glow: 'rgba(245,158,11,0.10)',
  },
  {
    slug: 'blogs',
    problem: '"Our blog isn\'t ranking on Google and feels detached from our main product."',
    solution: 'MDX Content Engines',
    description: 'SEO-optimized knowledge bases with syntax highlighting, search, and reading analytics.',
    icon: '✍️',
    tag: 'Blog Engine',
    accent: '#10B981',
    glow: 'rgba(16,185,129,0.10)',
  },
];

export function SceneProblems() {
  const { setState, setLabel } = useCursorState();

  return (
    <section
      id="scene-problems"
      data-scene="problems"
      className="section-padding relative"
      aria-label="Services overview"
    >
      <div className="container-site">
        <BlurReveal>
          <span className="text-xs font-mono text-[#06B6D4] uppercase tracking-widest">
            / 02 — Problem-First Services
          </span>
        </BlurReveal>

        <h2 className="text-display-md font-display font-black text-[#F8FAFC] mt-4 mb-4 max-w-3xl">
          <WordReveal
            text="Every client has a problem."
            delay={0.15}
            stagger={0.04}
            className="block"
          />
          <WordReveal
            text="We build the solution."
            delay={0.32}
            stagger={0.04}
            className="block gradient-text-cyan"
          />
        </h2>

        <BlurReveal delay={0.4}>
          <p className="text-[#94A3B8] mb-14 max-w-xl text-base leading-relaxed">
            We don&apos;t just sell code — we diagnose structural challenges and build tailored solutions.
          </p>
        </BlurReveal>

        {/* Service cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES_DATA.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: DURATION.slow, delay: 0.4 + i * 0.08, ease: EASE.premium }}
            >
              <Link
                href={`/services/${service.slug}`}
                onMouseEnter={() => { setState('hover-image'); setLabel('EXPLORE'); }}
                onMouseLeave={() => { setState('idle'); setLabel(''); }}
                className="group flex flex-col h-full rounded-2xl glass-card p-7 relative overflow-hidden"
                id={`service-card-${service.slug}`}
              >
                {/* Background glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(ellipse at 0% 0%, ${service.glow} 0%, transparent 60%)` }}
                />

                {/* Top bar accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, ${service.accent}, transparent)` }}
                />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${service.accent}15`, border: `1px solid ${service.accent}30` }}
                    >
                      {service.icon}
                    </div>
                    <span
                      className="text-[11px] font-mono px-3 py-1 rounded-full uppercase tracking-wide"
                      style={{ color: service.accent, background: `${service.accent}10`, border: `1px solid ${service.accent}25` }}
                    >
                      {service.tag}
                    </span>
                  </div>

                  {/* Problem statement */}
                  <p className="text-xs italic text-[#64748B] mb-4 leading-relaxed">{service.problem}</p>

                  {/* Solution title */}
                  <h3
                    className="font-display font-bold text-xl text-[#F8FAFC] mb-2 transition-colors duration-300 group-hover:text-white"
                    style={{ '--hover-color': service.accent } as React.CSSProperties}
                  >
                    {service.solution}
                  </h3>

                  <p className="text-sm text-[#94A3B8] leading-relaxed flex-1 mb-6">{service.description}</p>

                  {/* Footer CTA */}
                  <div
                    className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.06)] text-xs font-semibold"
                    style={{ color: service.accent }}
                  >
                    <span>View Service Specs</span>
                    <motion.span
                      className="inline-block"
                      whileHover={{ x: 4 }}
                      transition={{ duration: DURATION.fast }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
