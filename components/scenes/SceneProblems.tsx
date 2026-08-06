'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BlurReveal, WordReveal } from '@/components/motion';
import { useCursorState } from '@/providers/CursorProvider';
import { DURATION, EASE } from '@/lib/motion/tokens';
import { Globe, Layers, Smartphone, Clapperboard, BookOpen, ArrowUpRight } from 'lucide-react';

const CAPABILITIES_DATA = [
  {
    slug: 'website',
    title: 'Custom Web Engineering',
    subtitle: 'High-Performance Marketing & Brand Platforms',
    description: 'Next.js 15, TypeScript, and serverless architecture optimized for core web vitals and conversions.',
    icon: Globe,
    tag: 'Web Platforms',
    accent: '#3B82F6',
  },
  {
    slug: 'web-apps',
    title: 'Full-Stack Web Applications',
    subtitle: 'SaaS Platforms & Enterprise Workbenches',
    description: 'React 19, serverless cloud databases, authenticated dashboards, and real-time API integrations.',
    icon: Layers,
    tag: 'SaaS & Web Software',
    accent: '#06B6D4',
  },
  {
    slug: 'android-apps',
    title: 'Native Android Applications',
    subtitle: 'High-Performance Mobile Software',
    description: 'Clean mobile architecture, reactive UI components, offline caching, and native hardware API access.',
    icon: Smartphone,
    tag: 'Mobile Software',
    accent: '#8B5CF6',
  },
  {
    slug: 'ai-videos',
    title: 'AI Video & Media Production',
    subtitle: 'Automated 4K Commercial Pipelines',
    description: 'Automated video generation pipelines for product launches, brand reels, and promotional visual media.',
    icon: Clapperboard,
    tag: 'Visual Media',
    accent: '#F59E0B',
  },
  {
    slug: 'blogs',
    title: 'MDX Content Engines',
    subtitle: 'SEO Knowledge Bases & Publications',
    description: 'Structure-first documentation hubs and technical publishing platforms with instant search and reading analytics.',
    icon: BookOpen,
    tag: 'Content Architecture',
    accent: '#10B981',
  },
];

export function SceneProblems() {
  const { setState, setLabel } = useCursorState();

  return (
    <section
      id="scene-problems"
      data-scene="problems"
      className="section-padding relative"
      aria-label="Core Capabilities"
    >
      <div className="container-site">
        <BlurReveal>
          <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest font-semibold">
            / 02 — Core Capabilities
          </span>
        </BlurReveal>

        <BlurReveal delay={0.15}>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC] mt-3 mb-4 max-w-3xl leading-tight">
            Specialized technical execution{' '}
            <span className="text-[#3B82F6] inline-block">across key digital domains.</span>
          </h2>
        </BlurReveal>

        <BlurReveal delay={0.4}>
          <p className="text-[#334155] dark:text-[#94A3B8] mb-8 max-w-2xl text-lg sm:text-xl leading-relaxed font-body font-medium">
            We partner with teams to design, architect, and ship high-grade digital products with zero compromise on speed or reliability.
          </p>
        </BlurReveal>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAPABILITIES_DATA.map((item, i) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: DURATION.slow, delay: 0.2 + i * 0.08, ease: EASE.premium }}
              >
                <Link
                  href={`/services/${item.slug}`}
                  onMouseEnter={() => { setState('hover-image'); setLabel('VIEW'); }}
                  onMouseLeave={() => { setState('idle'); setLabel(''); }}
                  className="group flex flex-col h-full rounded-2xl glass-card p-8 relative overflow-hidden border border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.35)] transition-all"
                  id={`capability-card-${item.slug}`}
                >
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      {/* Top Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110"
                          style={{ background: `${item.accent}18`, border: `1px solid ${item.accent}30` }}
                        >
                          <IconComponent size={24} style={{ color: item.accent }} />
                        </div>
                        <span
                          className="text-xs font-mono px-3 py-1 rounded-full uppercase tracking-wider font-semibold"
                          style={{ color: item.accent, background: `${item.accent}12`, border: `1px solid ${item.accent}25` }}
                        >
                          {item.tag}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="font-display font-bold text-2xl text-[#0F172A] dark:text-[#F8FAFC] mb-1.5 group-hover:text-[#3B82F6] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs font-mono text-[#475569] dark:text-[#94A3B8] mb-4 font-medium">
                        {item.subtitle}
                      </p>

                      <p className="text-base text-[#334155] dark:text-[#94A3B8] leading-relaxed mb-8 font-body font-medium">
                        {item.description}
                      </p>
                    </div>

                    {/* Footer link */}
                    <div
                      className="flex items-center justify-between pt-5 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] text-sm font-semibold text-[#0F172A] dark:text-[#CBD5E1] group-hover:text-[#3B82F6] transition-colors"
                    >
                      <span>Explore Technical Specs</span>
                      <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
