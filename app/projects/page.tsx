import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal } from '@/components/motion';
import { adminDb } from '@/lib/firebase/admin';
import { ArrowUpRight, Zap } from 'lucide-react';

export const revalidate = 0; // Dynamic server fetching — instant sync with Admin Panel!

type ProjectCard = {
  slug: string;
  title: string;
  category: string;
  description: string;
  metrics: string;
  tech: string[];
  image: string;
};

const DEFAULT_PROJECTS = [
  {
    slug: 'abjee-travel',
    title: 'ABjee Travel',
    category: 'Next.js 15 Web App',
    description: 'Explore tourist places, connect with fellow travellers, read trip stories, and make travel itineraries.',
    metrics: 'Lighthouse: 99/100 · Live Production',
    tech: ['Next.js 15', 'Tailwind', 'TypeScript'],
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
  },
  {
    slug: 'aura-studio-platform',
    title: 'Aura Studio Platform',
    category: 'Next.js 15 Platform',
    description: 'Living web operating system built with modular component architecture, 60fps animations, and edge delivery.',
    metrics: 'Lighthouse: 99/100 · Live Production',
    tech: ['Next.js 15', 'Tailwind', 'GSAP', 'Lenis'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
  },
  {
    slug: 'cyberpulse-saas-dashboard',
    title: 'CyberPulse SaaS Dashboard',
    category: 'Full-Stack Web App',
    description: 'Enterprise real-time analytics portal with WebSocket telemetry and serverless API backend.',
    metrics: 'Lighthouse: 98/100 · Active QA',
    tech: ['React 19', 'TypeScript', 'Serverless'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  },
  {
    slug: 'omnitrade-mobile-app',
    title: 'OmniTrade Mobile Software',
    category: 'Native Android App',
    description: 'Native Android trading suite with low-latency order execution and biometric authentication.',
    metrics: 'Lighthouse: 97/100 · In Development',
    tech: ['Kotlin', 'Jetpack Compose', 'Clean Arch'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
  },
];

const fallbackTech = ['Next.js 15', 'TypeScript', 'Tailwind'];
const fallbackImage = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80';

function asText(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function asTechList(value: unknown) {
  if (Array.isArray(value)) {
    const items = value.filter((item): item is string => typeof item === 'string' && Boolean(item.trim()));
    return items.length ? items.map((item) => item.trim()) : fallbackTech;
  }

  if (typeof value === 'string') {
    const items = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    return items.length ? items : fallbackTech;
  }

  return fallbackTech;
}

async function getFirestoreProjects() {
  try {
    const snap = await adminDb.collection('projects').get();
    if (!snap.empty) {
      return snap.docs.map((doc): ProjectCard => {
        const data = doc.data();
        return {
          slug: doc.id,
          title: asText(data.name || data.title, doc.id),
          category: asText(data.category, 'Engineering Case'),
          description: asText(data.summary || data.description, 'High-performance digital engineering product.'),
          metrics: `Lighthouse: ${data.lighthouseScore || 99}/100 · ${data.status || 'Live Production'}`,
          tech: asTechList(data.techStack || data.tech),
          image: asText(data.image, fallbackImage),
        };
      });
    }
  } catch (err) {
    console.error('Error fetching Firestore projects for /projects page:', err);
  }
  return DEFAULT_PROJECTS;
}

export default async function ProjectsOverviewPage() {
  const projectsList = await getFirestoreProjects();

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen bg-[#F8FAFC] dark:bg-[#06070A]">
        <div className="container-site">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <BlurReveal>
              <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest font-semibold block mb-2">
                / 02 — Case Studies & Portfolio
              </span>
            </BlurReveal>

            <BlurReveal delay={0.15}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC] mb-4 leading-tight">
                Engineered products that{' '}
                <span className="text-[#3B82F6] inline-block">speak for themselves.</span>
              </h1>
            </BlurReveal>

            <BlurReveal delay={0.3}>
              <p className="text-lg sm:text-xl text-[#334155] dark:text-[#CBD5E1] leading-relaxed font-body font-medium">
                Explore deep dives into our architecture choices, UI design systems, performance benchmarks, and client business outcomes. Managed live from the Devzite Studio Admin Panel.
              </p>
            </BlurReveal>
          </div>

          {/* Grid of Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectsList.map((p, index) => (
              <BlurReveal key={p.slug} delay={0.15 + index * 0.08}>
                <div
                  className="group flex flex-col justify-between h-full rounded-3xl glass-card p-6 sm:p-7 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] hover:border-[rgba(59,130,246,0.35)] transition-all duration-300 shadow-xl relative overflow-hidden bg-white dark:bg-[#0C0D14]"
                >
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Project Cover Image */}
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-6 border border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-[#0C0D14]">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          unoptimized={p.image?.startsWith('data:')}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase bg-[#0C0D14]/80 text-[#3B82F6] backdrop-blur-md border border-[rgba(255,255,255,0.1)]">
                          {p.category}
                        </span>
                      </div>

                      <h2 className="font-display font-bold text-2xl text-[#0F172A] dark:text-[#F8FAFC] mb-3 group-hover:text-[#3B82F6] transition-colors">
                        {p.title}
                      </h2>
                      <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed mb-6 font-body font-medium">
                        {p.description}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-mono text-[#3B82F6] mb-4 p-2.5 rounded-xl bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.18)] font-semibold flex items-center gap-1.5">
                        <Zap size={14} className="text-[#3B82F6]" />
                        {p.metrics}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {p.tech.map((t: string) => (
                          <span
                            key={t}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-[rgba(15,23,42,0.04)] dark:bg-[rgba(255,255,255,0.04)] text-[#334155] dark:text-[#CBD5E1] border border-[rgba(15,23,42,0.06)] dark:border-[rgba(255,255,255,0.06)] font-semibold"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/projects/${p.slug}`}
                        className="flex items-center justify-between text-xs font-mono font-bold text-[#3B82F6] pt-4 border-t border-[rgba(15,23,42,0.08)] dark:border-[rgba(255,255,255,0.08)] hover:underline"
                      >
                        <span>Explore Technical Specs</span>
                        <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </BlurReveal>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
