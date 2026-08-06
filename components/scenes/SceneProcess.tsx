'use client';

import { BlurReveal, WordReveal } from '@/components/motion';

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
    tagline: 'Next.js & Serverless Engineering',
    description: 'Clean, modular engineering with Next.js 15, GSAP, and serverless cloud architecture.',
    deliverables: ['Production Codebase', 'API Layer Integration', 'Performance Audit'],
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <BlurReveal>
              <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest font-semibold">
                / 03 — Process
              </span>
            </BlurReveal>

            <h2 className="text-display-md font-display font-black text-[#F8FAFC] mt-4">
              <WordReveal text="From initial concept" delay={0.15} stagger={0.04} className="block mb-1" />
              <WordReveal text="to edge deployment." delay={0.32} stagger={0.04} className="block gradient-text-blue" wordClassName="gradient-text-blue" />
            </h2>
          </div>

          <BlurReveal delay={0.3}>
            <p className="text-base text-[#CBD5E1] max-w-md mt-4 md:mt-0 leading-relaxed font-body">
              A disciplined 5-stage engineering workflow pinned with precision, ensuring zero friction from discovery to launch.
            </p>
          </BlurReveal>
        </div>

        {/* Process Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {PROCESS_STEPS.map((step, i) => (
            <BlurReveal key={step.step} delay={0.2 + i * 0.1}>
              <div className="flex flex-col justify-between h-full rounded-2xl glass-card p-7 relative group">
                <div>
                  {/* Step number badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-display font-black text-4xl gradient-text">
                      {step.step}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] group-hover:scale-150 transition-transform" />
                  </div>

                  <h3 className="font-display font-bold text-2xl text-[#F8FAFC] mb-1">
                    {step.name}
                  </h3>

                  <p className="text-xs font-mono text-[#06B6D4] mb-4 font-semibold">
                    {step.tagline}
                  </p>

                  <p className="text-sm text-[#CBD5E1] leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Deliverables */}
                <div className="pt-5 border-t border-[rgba(255,255,255,0.08)]">
                  <p className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-3 font-semibold">
                    Key Deliverables:
                  </p>
                  <ul className="space-y-2">
                    {step.deliverables.map((d) => (
                      <li key={d} className="text-xs text-[#CBD5E1] flex items-center gap-2 font-medium">
                        <span className="text-[#3B82F6] font-bold">✓</span> {d}
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
