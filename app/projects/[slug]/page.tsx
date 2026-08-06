import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal, TextReveal, CountUp } from '@/components/motion';

const CASE_STUDIES: Record<string, {
  title: string;
  category: string;
  client: string;
  summary: string;
  gradient: string;
  metrics: { label: string; value: number; suffix: string }[];
  goals: string[];
  challenge: string;
  solution: string;
  architecture: string[];
  lighthouse: { performance: number; accessibility: number; bestPractices: number; seo: number };
  tech: string[];
  review: { author: string; role: string; quote: string };
}> = {
  'nexus-ai-studio': {
    title: 'Nexus AI Studio Platform',
    category: 'Web Application & AI Workflow',
    client: 'Nexus AI Inc.',
    summary: 'An enterprise generative AI workbench enabling real-time video generation pipelines, prompt engineering, and team collaboration.',
    gradient: 'from-[#3B82F6] to-[#06B6D4]',
    metrics: [
      { label: 'Conversion Boost', value: 140, suffix: '%' },
      { label: 'Lighthouse Performance', value: 99, suffix: '/100' },
      { label: 'Active Users', value: 50, suffix: 'K+' },
    ],
    goals: [
      'Eliminate 3.5s initial load latency on complex WebGL canvas pages.',
      'Construct a real-time multiplayer prompt editor for distributed creative teams.',
      'Integrate Firebase Auth, Firestore security rules, and cloud function rendering.',
    ],
    challenge: 'Generative AI workflows require streaming heavy payloads while keeping UI responsiveness at 60fps. Legacy tools suffered from state re-render bottlenecks.',
    solution: 'We engineered a modular Next.js 15 App Router architecture with strict server component boundaries, Web Workers for payload parsing, and GSAP animation tokens.',
    architecture: [
      'Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS 4, GSAP',
      '3D Layer: React Three Fiber, Drei, WebGL shaders',
      'Backend: Firebase Serverless (Firestore, Auth, Cloud Storage, Functions)',
      'Edge CDN: Vercel Global Edge Network',
    ],
    lighthouse: { performance: 99, accessibility: 100, bestPractices: 98, seo: 100 },
    tech: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Firebase', 'GSAP', 'R3F'],
    review: {
      author: 'Alexander Wright',
      role: 'CTO, Nexus AI',
      quote: 'Innovatech Solutions delivered a product that looks like Apple designed it and loads like Google built it.',
    },
  },
  'aura-fitness': {
    title: 'Aura Fitness & Wellness Mobile Platform',
    category: 'Native Mobile & SaaS App',
    client: 'Aura Health Ltd.',
    summary: 'A full-stack Android & Web application providing real-time biometric tracking, video workout classes, and AI coach scheduling.',
    gradient: 'from-[#8B5CF6] to-[#3B82F6]',
    metrics: [
      { label: 'App Store Rating', value: 5, suffix: '★' },
      { label: 'Monthly Active Users', value: 120, suffix: 'K' },
      { label: 'API Response Time', value: 42, suffix: 'ms' },
    ],
    goals: [
      'Build offline-first synchronization for workout logs in low-connectivity areas.',
      'Achieve 60fps scrolling performance across low-end Android devices.',
      'Deploy real-time push notification reminders based on biometric triggers.',
    ],
    challenge: 'Biometric stream processing caused memory leaks on older devices, leading to app crashes during long workout sessions.',
    solution: 'We rebuilt the mobile architecture with Kotlin Clean Architecture, Room database offline caching, and reactive Kotlin Flow streams.',
    architecture: [
      'Android Native: Kotlin, Jetpack Compose, Coroutines, Flow',
      'Web Dashboard: React 19, TypeScript, Tailwind CSS',
      'Backend: Firebase Realtime Database, Cloud Messaging, Storage',
    ],
    lighthouse: { performance: 96, accessibility: 98, bestPractices: 95, seo: 98 },
    tech: ['Android Native', 'Kotlin', 'React 19', 'Firebase', 'Tailwind'],
    review: {
      author: 'Elena Rostova',
      role: 'Head of Product, Aura Health',
      quote: 'Our mobile user retention jumped 38% after releasing the new Android app built by Innovatech.',
    },
  },
  'lumina-cloud': {
    title: 'Lumina Cloud Infrastructure Dashboard',
    category: 'Cloud Infrastructure & 3D Visualization',
    client: 'Lumina Systems',
    summary: 'High-performance cloud management portal with real-time telemetry charts, dynamic server provisioning, and automated audits.',
    gradient: 'from-[#06B6D4] to-[#8B5CF6]',
    metrics: [
      { label: 'Deployment Speed', value: 3, suffix: 'x Faster' },
      { label: 'Uptime SLA', value: 100, suffix: '%' },
      { label: 'Cloud Cost Reduction', value: 35, suffix: '%' },
    ],
    goals: [
      'Visualize 10,000+ active cloud nodes in a interactive 3D WebGL topology map.',
      'Implement role-based access for multi-tenant enterprise organizations.',
      'Provide instant audit log export with cryptographic verification.',
    ],
    challenge: 'Rendering 10k nodes simultaneously crushed browser framerates from 60fps down to single digits.',
    solution: 'We implemented GPU instanced mesh rendering in R3F, allowing 10,000 nodes to render in a single draw call with 60fps fluidity.',
    architecture: [
      'Visualization: React Three Fiber, Three.js instanced rendering',
      'Web App: Next.js 15, TypeScript, Tailwind CSS',
      'Security: Firebase Auth with custom claims & audit logging',
    ],
    lighthouse: { performance: 98, accessibility: 96, bestPractices: 98, seo: 96 },
    tech: ['Next.js 15', 'Three.js / R3F', 'TypeScript', 'Firebase Auth'],
    review: {
      author: 'Marcus Vance',
      role: 'Founder, Lumina Systems',
      quote: 'The custom 3D telemetry visualizations set our product apart in pitch meetings. Worth every penny.',
    },
  },
};

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = CASE_STUDIES[slug];

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen">
        <div className="container-site">
          {/* Hero Header */}
          <div className="max-w-4xl mb-16">
            <BlurReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-[rgba(255,255,255,0.08)] mb-4">
                <span className="text-xs font-mono text-[#06B6D4] uppercase tracking-wider">
                  {project.category} · Client: {project.client}
                </span>
              </div>
            </BlurReveal>

            <TextReveal
              text={project.title}
              className="text-display-lg font-display font-black text-[#F8FAFC] mb-6"
              delay={0.2}
            />

            <BlurReveal delay={0.35}>
              <p className="text-lg text-[#94A3B8] leading-relaxed">
                {project.summary}
              </p>
            </BlurReveal>
          </div>

          {/* Metrics Banner */}
          <BlurReveal delay={0.4}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-8 rounded-3xl glass border border-[rgba(255,255,255,0.08)] mb-16 bg-gradient-to-r from-[rgba(59,130,246,0.04)] to-transparent">
              {project.metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-display font-black gradient-text mb-1">
                    <CountUp end={m.value} suffix={m.suffix} duration={2} />
                  </div>
                  <div className="text-xs font-mono text-[#64748B] uppercase tracking-wider">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </BlurReveal>

          {/* Challenge & Solution Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <BlurReveal>
              <div className="rounded-3xl glass p-8 border border-[rgba(255,255,255,0.08)] h-full">
                <span className="text-2xl mb-4 block">⚠️</span>
                <h3 className="font-display font-bold text-xl text-[#F8FAFC] mb-3">
                  The Technical Challenge
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  {project.challenge}
                </p>
              </div>
            </BlurReveal>

            <BlurReveal delay={0.2}>
              <div className="rounded-3xl glass p-8 border border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.02)] h-full">
                <span className="text-2xl mb-4 block">💡</span>
                <h3 className="font-display font-bold text-xl text-[#F8FAFC] mb-3">
                  Our Engineering Solution
                </h3>
                <p className="text-sm text-[#F8FAFC] leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </BlurReveal>
          </div>

          {/* Project Goals */}
          <div className="mb-16">
            <BlurReveal>
              <h3 className="font-display font-bold text-2xl text-[#F8FAFC] mb-6">
                Project Objectives
              </h3>
            </BlurReveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {project.goals.map((g, i) => (
                <BlurReveal key={g} delay={0.2 + i * 0.1}>
                  <div className="rounded-2xl glass p-6 border border-[rgba(255,255,255,0.08)] h-full">
                    <span className="text-xs font-mono text-[#3B82F6] block mb-2">
                      Goal 0{i + 1}
                    </span>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">{g}</p>
                  </div>
                </BlurReveal>
              ))}
            </div>
          </div>

          {/* Architecture & Tech Stack */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-7">
              <BlurReveal>
                <div className="rounded-3xl glass p-8 border border-[rgba(255,255,255,0.08)] h-full">
                  <h3 className="font-display font-bold text-xl text-[#F8FAFC] mb-4">
                    Architecture Breakdown
                  </h3>
                  <ul className="space-y-3">
                    {project.architecture.map((a) => (
                      <li key={a} className="text-xs font-mono text-[#94A3B8] flex items-center gap-2">
                        <span className="text-[#06B6D4]">⚙️</span> {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </BlurReveal>
            </div>

            {/* Lighthouse Scores */}
            <div className="lg:col-span-5">
              <BlurReveal delay={0.2}>
                <div className="rounded-3xl glass p-8 border border-[rgba(255,255,255,0.08)] h-full">
                  <h3 className="font-display font-bold text-xl text-[#F8FAFC] mb-6">
                    Lighthouse Audit Verification
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    {Object.entries(project.lighthouse).map(([key, val]) => (
                      <div key={key} className="p-3 rounded-xl bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.06)]">
                        <span className="text-2xl font-display font-bold text-[#27C93F]">{val}</span>
                        <span className="text-[10px] font-mono text-[#64748B] block uppercase mt-1">{key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </BlurReveal>
            </div>
          </div>

          {/* Client Testimonial */}
          <BlurReveal>
            <div className="rounded-3xl glass p-8 sm:p-12 border border-[rgba(255,255,255,0.08)] mb-16 text-center max-w-3xl mx-auto">
              <span className="text-4xl mb-4 block">💬</span>
              <p className="text-base sm:text-lg text-[#F8FAFC] italic font-serif leading-relaxed mb-6">
                &ldquo;{project.review.quote}&rdquo;
              </p>
              <h4 className="font-display font-bold text-sm text-[#F8FAFC]">{project.review.author}</h4>
              <p className="text-xs font-mono text-[#64748B]">{project.review.role}</p>
            </div>
          </BlurReveal>

          {/* Navigation CTA */}
          <div className="flex justify-between items-center pt-8 border-t border-[rgba(255,255,255,0.06)]">
            <Link href="/projects" className="text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC]">
              ← Back to All Case Studies
            </Link>
            <Link href="/contact" className="text-xs font-mono text-[#3B82F6] font-bold hover:text-[#60A5FA]">
              Start Your Own Project →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
