import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal, TextReveal } from '@/components/motion';

const PROJECTS_LIST = [
  {
    slug: 'nexus-ai-studio',
    title: 'Nexus AI Studio Workbench',
    category: 'Web Application & AI Workflow',
    description: 'An enterprise generative AI platform for video storytelling, prompt engineering, and team collaboration.',
    metrics: '+140% Conversion · 99 Lighthouse · 50K Active Users',
    tech: ['Next.js 15', 'TypeScript', 'Firebase', 'GSAP'],
    gradient: 'from-[#3B82F6] to-[#06B6D4]',
    icon: '🤖',
  },
  {
    slug: 'aura-fitness',
    title: 'Aura Fitness & Wellness Mobile Platform',
    category: 'Native Mobile & SaaS App',
    description: 'A full-stack Android & Web application providing real-time biometric tracking and AI workout coaching.',
    metrics: '4.9 App Rating · 120K Active Users · 42ms Latency',
    tech: ['Android Native', 'React 19', 'Firebase', 'Motion'],
    gradient: 'from-[#8B5CF6] to-[#3B82F6]',
    icon: '📱',
  },
  {
    slug: 'lumina-cloud',
    title: 'Lumina Cloud Infrastructure Dashboard',
    category: 'Cloud Infrastructure & 3D Visualization',
    description: 'High-performance cloud management portal with real-time telemetry charts and custom 3D server visualizations.',
    metrics: '3x Faster Deploys · 99.99% Uptime SLA · -35% Cloud Cost',
    tech: ['Next.js 15', 'R3F / Three.js', 'Tailwind', 'Firebase'],
    gradient: 'from-[#06B6D4] to-[#8B5CF6]',
    icon: '☁️',
  },
];

export default function ProjectsOverviewPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen">
        <div className="container-site">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <BlurReveal>
              <span className="text-xs font-mono text-[#8B5CF6] uppercase tracking-widest">
                / Case Studies & Portfolio
              </span>
            </BlurReveal>

            <TextReveal
              text="Engineered products that speak for themselves."
              className="text-display-lg font-display font-black text-[#F8FAFC] mt-4 mb-6"
              delay={0.2}
            />

            <BlurReveal delay={0.35}>
              <p className="text-lg text-[#94A3B8] leading-relaxed">
                Explore deep dives into our architecture choices, UI design systems, performance benchmarks, and client business outcomes.
              </p>
            </BlurReveal>
          </div>

          {/* Grid of Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS_LIST.map((p, index) => (
              <BlurReveal key={p.slug} delay={0.2 + index * 0.1}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="group flex flex-col justify-between h-full rounded-3xl glass p-8 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.3)] transition-all duration-300 shadow-2xl relative overflow-hidden"
                >
                  <div className={`aspect-video rounded-2xl bg-gradient-to-br ${p.gradient} opacity-20 group-hover:opacity-30 transition-opacity flex items-center justify-center mb-6`}>
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                      {p.icon}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-[#06B6D4] uppercase tracking-wider block mb-2">
                        {p.category}
                      </span>
                      <h2 className="font-display font-bold text-2xl text-[#F8FAFC] mb-3 group-hover:text-[#60A5FA] transition-colors">
                        {p.title}
                      </h2>
                      <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                        {p.description}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-mono text-[#3B82F6] mb-4 p-2 rounded-lg bg-[rgba(59,130,246,0.05)] border border-[rgba(59,130,246,0.15)]">
                        📊 {p.metrics}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {p.tech.map((t) => (
                          <span key={t} className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[rgba(255,255,255,0.04)] text-[#94A3B8]">
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold text-[#3B82F6] pt-4 border-t border-[rgba(255,255,255,0.06)]">
                        <span>Read Case Study</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
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
