import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal, TextReveal } from '@/components/motion';

const ALL_SERVICES = [
  {
    slug: 'website',
    title: 'Website Design & Development',
    tagline: 'Awwwards-Level Digital Experiences',
    problem: 'Your current website looks template-based, loads slowly, and fails to differentiate your brand.',
    approach: 'We craft bespoke Next.js + GSAP + R3F web applications with fluid motion tokens and Lighthouse 95+ performance.',
    tech: ['Next.js 15', 'GSAP', 'React Three Fiber', 'Lenis', 'Tailwind CSS'],
    icon: '🌐',
  },
  {
    slug: 'web-apps',
    title: 'Web & SaaS Platform Development',
    tagline: 'High-Scale Cloud Web Applications',
    problem: 'Legacy web apps struggle to scale, lack real-time reactivity, and suffer from poor UX design.',
    approach: 'Full-stack engineering with React 19, TypeScript, and serverless Firebase infrastructure for infinite scale.',
    tech: ['React 19', 'TypeScript', 'Firebase Firestore', 'Cloud Functions', 'Tailwind'],
    icon: '⚙️',
  },
  {
    slug: 'android-apps',
    title: 'Android Mobile Application Dev',
    tagline: 'Native Android Performance & UX',
    problem: 'Hybrid cross-platform apps often feel laggy, unpolished, and fail to leverage native device capabilities.',
    approach: 'Custom Android application development focused on 60fps animations, offline sync, and clean architecture.',
    tech: ['Android Native', 'Kotlin', 'Firebase Realtime', 'Jetpack Compose'],
    icon: '📱',
  },
  {
    slug: 'ai-videos',
    title: 'AI Video Storytelling Pipeline',
    tagline: 'Automated 7-Step Content Creation',
    problem: 'Traditional commercial video creation takes months and tens of thousands of dollars per reel.',
    approach: '7-step automated AI workflow for scriptwriting, voice synthesis, storyboard animation, and 4K rendering.',
    tech: ['Script AI', 'Voice Synth', 'Storyboard AI', 'Render Engine', 'CapCut Pro'],
    icon: '🎬',
  },
  {
    slug: 'blogs',
    title: 'MDX Content Engines & SEO',
    tagline: 'Knowledge Bases & Content Platforms',
    problem: 'Standard blogs suffer from slow indexing, generic typography, and zero interactive code playgrounds.',
    approach: 'SEO-driven MDX blog platforms with syntax highlighting, live search, interactive diagrams, and analytics.',
    tech: ['MDX', 'Shiki Syntax', 'Fuse.js', 'Mermaid.js', 'Tailwind Typography'],
    icon: '✍️',
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen">
        <div className="container-site">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <BlurReveal>
              <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest">
                / Services & Capabilities
              </span>
            </BlurReveal>

            <TextReveal
              text="Engineered for high growth and digital dominance."
              className="text-display-lg font-display font-black text-[#F8FAFC] mt-4 mb-6"
              delay={0.2}
            />

            <BlurReveal delay={0.35}>
              <p className="text-lg text-[#94A3B8] leading-relaxed">
                We combine creative direction, modern frontend engineering, and serverless cloud backends to deliver software that sets the standard.
              </p>
            </BlurReveal>
          </div>

          {/* List of Services */}
          <div className="space-y-8">
            {ALL_SERVICES.map((s, index) => (
              <BlurReveal key={s.slug} delay={0.2 + index * 0.08}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group block rounded-3xl glass p-8 sm:p-10 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.3)] transition-all duration-300 shadow-2xl relative overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-8">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-3xl p-3 rounded-2xl glass border border-[rgba(255,255,255,0.08)]">
                          {s.icon}
                        </span>
                        <div>
                          <span className="text-xs font-mono text-[#06B6D4] uppercase tracking-wider block">
                            {s.tagline}
                          </span>
                          <h2 className="text-display-sm font-display font-bold text-[#F8FAFC] group-hover:text-[#60A5FA] transition-colors">
                            {s.title}
                          </h2>
                        </div>
                      </div>

                      <div className="mb-6 space-y-2">
                        <p className="text-xs italic text-[#64748B]">
                          <strong className="text-[#94A3B8] not-italic">The Problem:</strong> {s.problem}
                        </p>
                        <p className="text-sm text-[#94A3B8] leading-relaxed">
                          <strong className="text-[#F8FAFC] font-semibold">Our Approach:</strong> {s.approach}
                        </p>
                      </div>

                      {/* Tech stack pills */}
                      <div className="flex flex-wrap gap-2">
                        {s.tech.map((t) => (
                          <span
                            key={t}
                            className="px-3 py-1 rounded-full text-xs font-mono bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#F8FAFC]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-4 flex justify-end items-center">
                      <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                        Explore Service Specs
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </BlurReveal>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
