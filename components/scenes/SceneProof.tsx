'use client';

import Link from 'next/link';
import { BlurReveal, WordReveal, CountUp } from '@/components/motion';
import { useCursorState } from '@/providers/CursorProvider';

const FEATURED_PROJECTS = [
  {
    id: 'nexus-ai',
    title: 'Nexus AI Studio Platform',
    category: 'Web Application & AI Workflow',
    description: 'A Next.js 15 enterprise generative AI workbench with live video generation pipelines and real-time collaboration.',
    metrics: [
      { label: 'Conversion Boost', value: 140, suffix: '%' },
      { label: 'Lighthouse Score', value: 99, suffix: '/100' },
      { label: 'Active Users', value: 50, suffix: 'K+' },
    ],
    tech: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Firebase', 'GSAP'],
    client: 'Nexus AI Inc.',
    review: '"DevZite delivered a product that looks like Apple designed it and loads like Google built it."',
    slug: 'nexus-ai-studio',
    gradient: 'from-[#3B82F6] to-[#06B6D4]',
  },
  {
    id: 'aura-fitness',
    title: 'Aura Fitness & Wellness App',
    category: 'Native Mobile & SaaS Platform',
    description: 'A full-stack Android & Web application providing real-time biometric tracking, video workout classes, and AI coach scheduling.',
    metrics: [
      { label: 'App Store Rating', value: 4.9, suffix: '★' },
      { label: 'Monthly Active', value: 120, suffix: 'K' },
      { label: 'Latency', value: 42, suffix: 'ms' },
    ],
    tech: ['Android Native', 'React 19', 'Firebase Realtime', 'Tailwind', 'Motion'],
    client: 'Aura Health Ltd.',
    review: '"Working with DevZite was the best agency experience of my 12-year tech career. Highly recommended."',
    slug: 'aura-fitness',
    gradient: 'from-[#8B5CF6] to-[#3B82F6]',
  },
  {
    id: 'lumina-cloud',
    title: 'Lumina Cloud Edge Platform',
    category: 'Cloud Infrastructure & Dashboard',
    description: 'High-performance cloud management portal with real-time telemetry charts, dynamic server provisioning, and automated audits.',
    metrics: [
      { label: 'Deploy Speed', value: 3, suffix: 'x Faster' },
      { label: 'Uptime SLA', value: 99.99, suffix: '%' },
      { label: 'Cost Reduction', value: 35, suffix: '%' },
    ],
    tech: ['Next.js 15', 'Three.js / R3F', 'Tailwind CSS', 'Firebase Auth'],
    client: 'Lumina Systems',
    review: '"The custom 3D telemetry visualizations set our product apart in pitch meetings. Worth every penny."',
    slug: 'lumina-cloud',
    gradient: 'from-[#06B6D4] to-[#8B5CF6]',
  },
];

export function SceneProof() {
  const { setState, setLabel } = useCursorState();

  return (
    <section
      id="scene-proof"
      data-scene="proof"
      className="section-padding relative"
      aria-label="Featured projects proof"
    >
      <div className="container-site">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <BlurReveal>
              <span className="text-xs font-mono text-[#8B5CF6] uppercase tracking-widest">
                / 04 — Cinematic Case Studies
              </span>
            </BlurReveal>

            <h2 className="text-display-md font-display font-black text-[#F8FAFC] mt-4">
              <WordReveal text="Real work. Real numbers." delay={0.15} stagger={0.04} className="block" />
              <WordReveal text="Real impact." delay={0.35} stagger={0.06} className="block gradient-text" wordClassName="gradient-text" />
            </h2>
          </div>

          <BlurReveal delay={0.3}>
            <Link
              href="/projects"
              onMouseEnter={() => setState('hover-button')}
              onMouseLeave={() => setState('idle')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#3B82F6] hover:text-[#60A5FA] mt-4 md:mt-0 transition-colors"
            >
              Explore Full Portfolio →
            </Link>
          </BlurReveal>
        </div>

        {/* Projects showcases */}
        <div className="space-y-16">
          {FEATURED_PROJECTS.map((project, index) => (
            <BlurReveal key={project.id} delay={0.2 + index * 0.1}>
              <div className="rounded-3xl glass p-8 sm:p-12 border border-[rgba(255,255,255,0.08)] relative overflow-hidden group">
                {/* Background accent glow */}
                <div
                  className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl ${project.gradient} opacity-10 blur-3xl pointer-events-none group-hover:opacity-20 transition-opacity duration-500`}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                  {/* Left Specs & Copy */}
                  <div className="lg:col-span-7">
                    <span className="text-xs font-mono text-[#06B6D4] uppercase tracking-wider mb-2 block">
                      {project.category}
                    </span>

                    <h3 className="text-display-sm font-display font-black text-[#F8FAFC] mb-4">
                      {project.title}
                    </h3>

                    <p className="text-base text-[#94A3B8] leading-relaxed mb-6">
                      {project.description}
                    </p>

                    {/* Tech stack pills */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-full text-xs font-mono bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#F8FAFC]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.06)] mb-8">
                      {project.metrics.map((m) => (
                        <div key={m.label}>
                          <div className="text-xl sm:text-2xl font-display font-black text-[#F8FAFC]">
                            <CountUp end={typeof m.value === 'number' ? m.value : 0} suffix={m.suffix} duration={2} />
                          </div>
                          <div className="text-[10px] text-[#64748B] uppercase tracking-wider mt-0.5 font-mono">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Client quote */}
                    <div className="border-l-2 border-[#3B82F6] pl-4 mb-8">
                      <p className="text-xs text-[#94A3B8] italic font-serif leading-relaxed mb-1">
                        {project.review}
                      </p>
                      <span className="text-[11px] font-mono text-[#64748B]">
                        — Client Review, {project.client}
                      </span>
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/projects/${project.slug}`}
                      onMouseEnter={() => {
                        setState('hover-image');
                        setLabel('CASE STUDY');
                      }}
                      onMouseLeave={() => {
                        setState('idle');
                        setLabel('');
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                    >
                      Read Full Case Study
                      <span>→</span>
                    </Link>
                  </div>

                  {/* Right Mockup Graphic Container */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="w-full aspect-[4/3] rounded-2xl glass border border-[rgba(255,255,255,0.1)] flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-[rgba(255,255,255,0.02)] to-[rgba(59,130,246,0.05)] group-hover:scale-[1.02] transition-transform duration-500">
                      {/* Frame Mockup Visual */}
                      <div className="w-full h-full rounded-xl bg-[#0C0D14] border border-[rgba(255,255,255,0.1)] flex flex-col overflow-hidden shadow-2xl">
                        {/* Browser Top Bar */}
                        <div className="h-6 bg-[rgba(255,255,255,0.05)] border-b border-[rgba(255,255,255,0.06)] flex items-center gap-1.5 px-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                          <span className="text-[10px] font-mono text-[#64748B] ml-2">
                            https://{project.slug}.devzite.com
                          </span>
                        </div>
                        {/* Content preview */}
                        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                          <span className="text-4xl mb-3">🚀</span>
                          <span className="font-display font-bold text-sm text-[#F8FAFC] mb-1">
                            {project.title}
                          </span>
                          <span className="text-xs text-[#64748B] font-mono">
                            Live Interactive Preview
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
