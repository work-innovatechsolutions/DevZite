'use client';

import Link from 'next/link';
import { BlurReveal, TextReveal } from '@/components/motion';
import { useCursorState } from '@/providers/CursorProvider';

const SERVICES_DATA = [
  {
    slug: 'website',
    problem: '"Our current website looks generic and fails to convert visitors."',
    solution: 'Cinematic Websites',
    description: 'Next.js 15, GSAP & R3F digital experiences that position your brand ahead of competitors.',
    icon: '🌐',
    tag: 'Web Design',
  },
  {
    slug: 'web-apps',
    problem: '"We need a complex SaaS app platform that feels instant and handles heavy workloads."',
    solution: 'Web Applications',
    description: 'Full-stack platforms built with React 19, TypeScript, and Firebase serverless scale.',
    icon: '⚙️',
    tag: 'SaaS Platforms',
  },
  {
    slug: 'android-apps',
    problem: '"We want native Android users with fluid animations and offline capabilities."',
    solution: 'Android Applications',
    description: 'High-performance mobile applications built with clean architecture and reactive UI.',
    icon: '📱',
    tag: 'Mobile Apps',
  },
  {
    slug: 'ai-videos',
    problem: '"Our video content is expensive, slow to produce, and lacks cinematic polish."',
    solution: 'AI Video Production',
    description: '7-step automated AI video pipelines for product launches, brand reels, and ads.',
    icon: '🎬',
    tag: 'AI Content',
  },
  {
    slug: 'blogs',
    problem: '"Our blog isn\'t ranking on Google and feels detached from our main product."',
    solution: 'MDX Content Engines',
    description: 'SEO-optimized knowledge bases with syntax highlighting, search, and reading analytics.',
    icon: '✍️',
    tag: 'Blog Engine',
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

        <TextReveal
          text="Every client has a problem. We build the solution."
          className="text-display-md font-display font-black text-[#F8FAFC] mt-3 mb-4 max-w-3xl"
          delay={0.2}
        />

        <BlurReveal delay={0.3}>
          <p className="text-[#94A3B8] mb-12 max-w-xl text-base">
            We don&apos;t just sell code — we diagnose structural challenges and build tailored solutions to solve them.
          </p>
        </BlurReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((service, i) => (
            <BlurReveal key={service.slug} delay={0.4 + i * 0.08}>
              <Link
                href={`/services/${service.slug}`}
                onMouseEnter={() => {
                  setState('hover-image');
                  setLabel('EXPLORE');
                }}
                onMouseLeave={() => {
                  setState('idle');
                  setLabel('');
                }}
                className="group flex flex-col justify-between h-full rounded-2xl glass p-7 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.3)] hover:bg-[rgba(59,130,246,0.04)] transition-all duration-300 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                      {service.icon}
                    </span>
                    <span className="text-[11px] font-mono text-[#06B6D4] px-2.5 py-1 rounded-full glass border border-[rgba(6,182,212,0.2)] uppercase">
                      {service.tag}
                    </span>
                  </div>

                  <p className="text-xs italic text-[#64748B] mb-4 leading-relaxed">
                    {service.problem}
                  </p>

                  <h3 className="font-display font-bold text-xl text-[#F8FAFC] mb-2 group-hover:text-[#60A5FA] transition-colors">
                    {service.solution}
                  </h3>

                  <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.06)] text-xs font-semibold text-[#3B82F6]">
                  <span>View Service Specs</span>
                  <span className="group-hover:translate-x-1.5 transition-transform duration-200">→</span>
                </div>
              </Link>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
