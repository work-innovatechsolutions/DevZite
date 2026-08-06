'use client';

import dynamic from 'next/dynamic';
import { BlurReveal, TextReveal } from '@/components/motion';

const HolographicCube = dynamic(() => import('@/components/three/HolographicCube'), {
  ssr: false,
  loading: () => <div className="w-full h-[200px]" />,
});

const PROCESS_STEPS = [
  {
    step: '01',
    name: 'Discover',
    tagline: 'Technical Audit & Strategy',
    description: 'We analyze your target market, tech stack requirements, user personas, and competitor gaps.',
    deliverables: ['Product Architecture Doc', 'UX Wireframes', 'Tech Stack Specification'],
  },
  {
    step: '02',
    name: 'Design',
    tagline: 'Cinematic UI/UX System',
    description: 'We construct custom design systems, motion tokens, glass surfaces, and responsive layouts.',
    deliverables: ['Figma Design System', 'Interactive Prototypes', 'Motion Principles'],
  },
  {
    step: '03',
    name: 'Develop',
    tagline: 'Next.js & Firebase Engineering',
    description: 'Clean, modular engineering with Next.js 15, GSAP, R3F, and serverless Firebase architecture.',
    deliverables: ['Production Codebase', 'API Layer Integration', 'Performance Audit'],
    has3D: true,
  },
  {
    step: '04',
    name: 'Deploy',
    tagline: 'Vercel & Cloudflare Edge',
    description: 'Zero-downtime edge deployments with global CDN caching, image optimization, and analytics.',
    deliverables: ['Global CDN Edge Launch', 'Lighthouse 95+ Score', 'SEO Verification'],
  },
  {
    step: '05',
    name: 'Support',
    tagline: 'Continuous Optimization',
    description: 'Ongoing telemetry monitoring, feature rollouts, client dashboard access, and SLA support.',
    deliverables: ['24/7 Monitoring', 'Client Workspace Access', 'Quarterly Upgrades'],
  },
];

export function SceneProcess() {
  return (
    <section
      id="scene-process"
      data-scene="process"
      className="section-padding relative overflow-hidden"
      aria-label="Development process"
    >
      <div className="container-site">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <BlurReveal>
              <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest">
                / 03 — Process
              </span>
            </BlurReveal>

            <TextReveal
              text="From initial concept to edge deployment."
              className="text-display-md font-display font-black text-[#F8FAFC] mt-3"
              delay={0.2}
            />
          </div>

          <BlurReveal delay={0.3}>
            <p className="text-sm text-[#94A3B8] max-w-md mt-4 md:mt-0">
              A disciplined 5-stage engineering workflow pinned with precision, ensuring zero friction from discovery to launch.
            </p>
          </BlurReveal>
        </div>

        {/* Process Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {PROCESS_STEPS.map((step, i) => (
            <BlurReveal key={step.step} delay={0.2 + i * 0.1}>
              <div className="flex flex-col justify-between h-full rounded-2xl glass p-6 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.3)] transition-all duration-300 relative group">
                <div>
                  {/* Step number badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display font-black text-3xl gradient-text">
                      {step.step}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#3B82F6] group-hover:scale-150 transition-transform" />
                  </div>

                  <h3 className="font-display font-bold text-xl text-[#F8FAFC] mb-1">
                    {step.name}
                  </h3>

                  <p className="text-xs font-mono text-[#06B6D4] mb-3">
                    {step.tagline}
                  </p>

                  <p className="text-xs text-[#94A3B8] leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {step.has3D && (
                    <div className="my-2">
                      <HolographicCube />
                    </div>
                  )}
                </div>

                {/* Deliverables */}
                <div className="pt-4 border-t border-[rgba(255,255,255,0.06)]">
                  <p className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider mb-2">
                    Key Deliverables:
                  </p>
                  <ul className="space-y-1">
                    {step.deliverables.map((d) => (
                      <li key={d} className="text-[11px] text-[#94A3B8] flex items-center gap-1.5">
                        <span className="text-[#3B82F6]">✓</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
