'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Cpu, Layers, Smartphone, ShieldCheck, Zap } from 'lucide-react';
import { BlurReveal, WordReveal } from '@/components/motion';

interface BentoGridItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  accent?: string;
}

const BentoGridItem = ({
  title,
  description,
  icon,
  className,
  accent = '#3B82F6',
}: BentoGridItemProps) => {
  const variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, damping: 24, stiffness: 120 },
    },
  };

  return (
    <motion.div
      variants={variants}
      whileInView="visible"
      viewport={{ once: true, margin: '-5%' }}
      initial="hidden"
      className={cn(
        'group glass-card border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.35)] relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl p-7 transition-all duration-500 shadow-md',
        className
      )}
    >
      {/* Background subtle grid pattern */}
      <div className="absolute top-0 -right-1/2 z-0 size-full pointer-events-none opacity-20 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:24px_24px]" />

      {/* Large background watermark icon */}
      <div className="text-white/5 group-hover:text-white/10 absolute -right-2 -bottom-2 scale-[5] transition-all duration-700 pointer-events-none group-hover:scale-[5.3]">
        {icon}
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <div
            className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-500 group-hover:scale-110"
            style={{ background: `${accent}18`, border: `1px solid ${accent}35` }}
          >
            {icon}
          </div>
          <h3 className="mb-2 text-xl sm:text-2xl font-display font-extrabold tracking-tight text-[#F8FAFC] group-hover:text-[#3B82F6] transition-colors">
            {title}
          </h3>
          <p className="text-sm text-[#94A3B8] font-body leading-relaxed">{description}</p>
        </div>

        <div className="mt-6 flex items-center text-xs font-mono font-bold tracking-wider uppercase text-[#CBD5E1] group-hover:text-[#3B82F6] transition-colors">
          <span className="mr-1.5">View Architecture</span>
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 h-1 w-full blur-xl transition-all duration-500 group-hover:blur-md"
        style={{ background: `linear-gradient(to right, ${accent}, transparent)` }}
      />
    </motion.div>
  );
};

const items = [
  {
    title: 'Next.js 15 & React 19',
    description:
      'Server components, streaming SSR, and zero-bundle-size client logic for sub-second rendering.',
    icon: <Code className="size-6" />,
    size: 'large' as const,
    accent: '#3B82F6',
  },
  {
    title: 'Native Android Apps',
    description:
      'Kotlin & Jetpack Compose apps optimized for high-performance mobile devices.',
    icon: <Smartphone className="size-6" />,
    size: 'small' as const,
    accent: '#8B5CF6',
  },
  {
    title: 'Global Edge CDN',
    description: 'Sub-50ms latency response times deployed across distributed edge networks.',
    icon: <Zap className="size-6" />,
    size: 'medium' as const,
    accent: '#06B6D4',
  },
  {
    title: 'Design System & UI Craft',
    description: 'Tailwind CSS tokens, responsive layouts, and smooth Framer Motion micro-interactions.',
    icon: <Layers className="size-6" />,
    size: 'medium' as const,
    accent: '#EC4899',
  },
  {
    title: '100% Lighthouse Score',
    description: 'Core web vitals optimization for maximum search ranking and user conversion.',
    icon: <ShieldCheck className="size-6" />,
    size: 'small' as const,
    accent: '#10B981',
  },
  {
    title: 'AI Media & Content Engines',
    description:
      'Automated 4K visual assets, promotional videos, and MDX publishing pipelines.',
    icon: <Cpu className="size-6" />,
    size: 'large' as const,
    accent: '#F59E0B',
  },
];

export default function BentoGrid1() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="section-padding relative overflow-hidden" id="bento-features">
      <div className="container-site">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <BlurReveal>
            <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest font-semibold">
              / 03 — Feature Grid Architecture
            </span>
          </BlurReveal>

          <h2 className="text-display-md font-display font-black text-[#F8FAFC] mt-3 mb-4">
            <WordReveal text="Engineered for scalability & speed." delay={0.1} />
          </h2>

          <BlurReveal delay={0.25}>
            <p className="text-base sm:text-lg text-[#94A3B8] font-body leading-relaxed">
              Every deliverable is crafted with clean modular architecture, strict type safety, and global CDN caching.
            </p>
          </BlurReveal>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-5%' }}
        >
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              icon={item.icon}
              size={item.size}
              accent={item.accent}
              className={cn(
                item.size === 'large'
                  ? 'col-span-1 sm:col-span-2 md:col-span-4'
                  : item.size === 'medium'
                    ? 'col-span-1 sm:col-span-2 md:col-span-3'
                    : 'col-span-1 sm:col-span-1 md:col-span-2',
                'h-full'
              )}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
