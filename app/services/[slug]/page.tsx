import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal, TextReveal } from '@/components/motion';

const SERVICE_DETAILS: Record<string, {
  title: string;
  tagline: string;
  problem: string;
  approach: string;
  icon: string;
  process: { step: string; title: string; desc: string }[];
  features: string[];
  techStack: string[];
}> = {
  website: {
    title: 'Website Design & Development',
    tagline: 'Awwwards-Nominated Digital Experiences',
    problem: 'Generic websites suffer from slow load times, outdated templates, high bounce rates, and zero emotional resonance with high-value clients.',
    approach: 'We craft bespoke web platforms utilizing Next.js 15, GSAP ScrollTrigger, Lenis smooth scrolling, and selective R3F 3D visuals. Guaranteed 95+ Lighthouse performance.',
    icon: '🌐',
    process: [
      { step: '01', title: 'UX Architecture', desc: 'Sitemap structuring, user journey mapping, and conversion funnel optimization.' },
      { step: '02', title: 'Motion Design', desc: 'Defining motion tokens, liquid transitions, and micro-interactions.' },
      { step: '03', title: 'Frontend Build', desc: 'Next.js 15 App Router code with modular React components and Tailwind styling.' },
      { step: '04', title: 'Optimization', desc: 'Asset compression, edge caching setup, SEO schema generation, and Lighthouse audit.' },
    ],
    features: ['Custom Motion Design System', 'Selective 3D WebGL / R3F', 'Lenis Smooth Scrolling', 'Lighthouse 95+ Score', 'SEO & OpenGraph Tags'],
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'GSAP', 'React Three Fiber'],
  },
  'web-apps': {
    title: 'Web & SaaS Platform Development',
    tagline: 'High-Scale Cloud Web Applications',
    problem: 'SaaS platforms often fail due to brittle state management, slow database queries, poor security rules, and uninspiring dashboards.',
    approach: 'We engineer full-stack web applications backed by Firebase Firestore, Cloud Functions, role-based Auth, and real-time state listeners.',
    icon: '⚙️',
    process: [
      { step: '01', title: 'Schema Design', desc: 'Structuring relational/NoSQL collections, index strategies, and security rules.' },
      { step: '02', title: 'API & Auth', desc: 'Implementing Firebase Auth (Google/GitHub/Email) and secure Cloud Functions.' },
      { step: '03', title: 'Dashboard UI', desc: 'Building responsive SaaS workspace interfaces with real-time listeners.' },
      { step: '04', title: 'Security Audit', desc: 'Penetration testing security rules, Zod schema validation, and error bounds.' },
    ],
    features: ['Firebase Serverless Backend', 'Role-Based Auth (Admin/Client)', 'Realtime Firestore Listeners', 'Zod Schema Validation', 'Cloud Functions Integration'],
    techStack: ['React 19', 'TypeScript', 'Firebase Auth', 'Firestore', 'Tailwind'],
  },
  'android-apps': {
    title: 'Android Mobile Application Dev',
    tagline: 'Native Android UX & Architecture',
    problem: 'Cross-platform mobile frameworks frequently produce bloated binaries, lagged scroll performance, and broken native device integration.',
    approach: 'We build native Android applications focusing on 60fps UI animations, offline data caching, background push notifications, and biometric security.',
    icon: '📱',
    process: [
      { step: '01', title: 'App Architecture', desc: 'Clean Architecture with MVVM, reactive state streams, and offline store.' },
      { step: '02', title: 'Native UI Design', desc: 'Custom component design with smooth gesture controls and micro-animations.' },
      { step: '03', title: 'Backend Sync', desc: 'Firebase Realtime database sync, push notifications, and cloud messaging.' },
      { step: '04', title: 'Play Store Launch', desc: 'App bundle optimization, store listing assets, and release pipeline setup.' },
    ],
    features: ['Native Android Performance', 'Offline First Architecture', 'Cloud Messaging Notifications', 'Biometric Auth Integration', '60fps UI Animations'],
    techStack: ['Android Native', 'Kotlin', 'Firebase Messaging', 'Jetpack Compose'],
  },
  'ai-videos': {
    title: 'AI Video Storytelling Pipeline',
    tagline: 'Automated 7-Step Content Creation',
    problem: 'High-end commercial video production requires massive budgets, film crews, and months of editing timelines.',
    approach: 'We orchestrate automated AI workflows that convert brand prompts into cinematic storyboards, voiceovers, video clips, and 4K final renders.',
    icon: '🎬',
    process: [
      { step: '01', title: 'Script Gen', desc: 'Prompt engineering for compelling narrative arcs and product messaging.' },
      { step: '02', title: 'Voice Synth', desc: 'Ultra-realistic AI voiceover generation in multiple languages and tones.' },
      { step: '03', title: 'Storyboard AI', desc: 'Generating key visual frames with consistent style and lighting.' },
      { step: '04', title: 'Final Render', desc: 'Stitching, audio mixing, color grading, and 4K export.' },
    ],
    features: ['7-Step Automated Workflow', 'Multilingual AI Voiceovers', '4K Cinematic Output', 'Sub-48-Hour Turnaround', 'Custom Storyboard Generation'],
    techStack: ['Script AI', 'Voice Synth', 'Storyboard AI', 'Render Engine'],
  },
  blogs: {
    title: 'MDX Content Engines & SEO',
    tagline: 'Knowledge Bases & Content Platforms',
    problem: 'Traditional CMS blogs are slow, lack interactive code blocks, suffer from poor SEO structures, and offer weak reading experiences.',
    approach: 'We build MDX-driven content platforms equipped with table of contents, syntax highlighting, reading progress meters, search, and resource downloads.',
    icon: '✍️',
    process: [
      { step: '01', title: 'MDX Pipeline', desc: 'Configuring frontmatter schema, custom components, and static rendering.' },
      { step: '02', title: 'SEO Architecture', desc: 'Generating structured JSON-LD schemas, sitemaps, and dynamic OpenGraph cards.' },
      { step: '03', title: 'Reading UX', desc: 'Adding progress meters, Shiki code highlighting, and instant text search.' },
      { step: '04', title: 'Analytics', desc: 'Tracking scroll depth, time on page, and CTA conversion funnel performance.' },
    ],
    features: ['MDX Content Pipeline', 'Shiki Syntax Highlighting', 'Dynamic OpenGraph Images', 'Automated Sitemap Generation', 'Reading Progress & TOC'],
    techStack: ['Next.js 15', 'MDX', 'Shiki Syntax', 'Fuse.js', 'Tailwind Typography'],
  },
};

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICE_DETAILS[slug];

  if (!service) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen">
        <div className="container-site">
          {/* Header */}
          <div className="max-w-4xl mb-16">
            <BlurReveal>
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="text-3xl p-3 rounded-2xl glass border border-[rgba(255,255,255,0.08)]">
                  {service.icon}
                </span>
                <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest">
                  / Service Specification
                </span>
              </div>
            </BlurReveal>

            <TextReveal
              text={service.title}
              className="text-display-lg font-display font-black text-[#F8FAFC] mb-4"
              delay={0.2}
            />

            <BlurReveal delay={0.35}>
              <p className="text-xl text-[#06B6D4] font-mono mb-6">
                {service.tagline}
              </p>
            </BlurReveal>

            <BlurReveal delay={0.45}>
              <div className="p-6 rounded-2xl glass border border-[rgba(255,255,255,0.08)] mb-8 space-y-4">
                <p className="text-xs italic text-[#64748B] leading-relaxed">
                  <strong className="text-[#94A3B8] not-italic uppercase font-mono block mb-1">The Problem We Solve:</strong>
                  {service.problem}
                </p>
                <p className="text-sm text-[#F8FAFC] leading-relaxed">
                  <strong className="text-[#3B82F6] font-semibold block mb-1">Our Engineering Approach:</strong>
                  {service.approach}
                </p>
              </div>
            </BlurReveal>
          </div>

          {/* Execution Process */}
          <div className="mb-20">
            <BlurReveal>
              <h2 className="text-display-sm font-display font-bold text-[#F8FAFC] mb-8">
                Execution Workflow
              </h2>
            </BlurReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.process.map((p, i) => (
                <BlurReveal key={p.step} delay={0.2 + i * 0.1}>
                  <div className="rounded-2xl glass p-6 border border-[rgba(255,255,255,0.08)] h-full">
                    <span className="font-display font-black text-2xl gradient-text block mb-2">
                      {p.step}
                    </span>
                    <h3 className="font-display font-bold text-base text-[#F8FAFC] mb-2">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </BlurReveal>
              ))}
            </div>
          </div>

          {/* Features & Tech Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
            {/* Deliverable Features */}
            <div className="lg:col-span-7">
              <BlurReveal>
                <div className="rounded-3xl glass p-8 border border-[rgba(255,255,255,0.08)] h-full">
                  <h3 className="font-display font-bold text-xl text-[#F8FAFC] mb-6">
                    Key Features Included
                  </h3>
                  <ul className="space-y-4">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-[#94A3B8]">
                        <span className="w-5 h-5 rounded-full bg-[rgba(59,130,246,0.15)] text-[#3B82F6] flex items-center justify-center text-xs font-bold shrink-0">
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </BlurReveal>
            </div>

            {/* Tech Stack */}
            <div className="lg:col-span-5">
              <BlurReveal delay={0.2}>
                <div className="rounded-3xl glass p-8 border border-[rgba(255,255,255,0.08)] h-full">
                  <h3 className="font-display font-bold text-xl text-[#F8FAFC] mb-6">
                    Technology Stack
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {service.techStack.map((t) => (
                      <span
                        key={t}
                        className="px-4 py-2 rounded-xl text-xs font-mono bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#F8FAFC]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)]">
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      All projects include TypeScript strict typing, responsive breakpoints, and custom motion token configurations.
                    </p>
                  </div>
                </div>
              </BlurReveal>
            </div>
          </div>

          {/* Bottom CTA Box */}
          <BlurReveal>
            <div className="rounded-3xl glass p-10 border border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.03)] text-center max-w-3xl mx-auto">
              <h3 className="text-display-sm font-display font-bold text-[#F8FAFC] mb-3">
                Ready to build your {service.title}?
              </h3>
              <p className="text-sm text-[#94A3B8] mb-8">
                Schedule a technical discovery call with our engineering leads today.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold text-sm transition-all duration-300 shadow-xl"
              >
                Start Your Project Brief →
              </Link>
            </div>
          </BlurReveal>
        </div>
      </main>

      <Footer />
    </>
  );
}
