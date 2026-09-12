import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal, TextReveal, CountUp } from '@/components/motion';
import { CASE_STUDIES } from '@/lib/data/projects';

// Revalidate every 60 seconds so newly-added projects appear without a full rebuild
export const revalidate = 60;

export function generateStaticParams() {
  return Object.keys(CASE_STUDIES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = CASE_STUDIES[slug];
  if (!project) return {};

  return {
    title: `${project.title} | Case Study | Devzite`,
    description: project.summary,
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title: `${project.title} | Case Study | Devzite`,
      description: project.summary,
      url: `/projects/${slug}`,
    },
  };
}

async function getFirestoreProject(slug: string) {
  try {
    const { adminDb, isFirebaseAdminConfigured } = await import('@/lib/firebase/admin');
    if (isFirebaseAdminConfigured) {
      const doc = await adminDb.collection('projects').doc(slug).get();
      if (doc.exists) {
        return { slug: doc.id, ...doc.data() } as Record<string, any>;
      }
    }
  } catch (err) {
    console.error('Error fetching Firestore project for slug:', slug, err);
  }
  return null;
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hardcoded = CASE_STUDIES[slug];

  // If this is a hardcoded case study, render the rich full-detail view
  if (hardcoded) {
    const project = hardcoded;

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

  // Not a hardcoded case study — try to fetch from Firestore (admin-added projects)
  const fsProject = await getFirestoreProject(slug);
  if (!fsProject) notFound();

  const techStack: string[] = Array.isArray(fsProject.techStack)
    ? fsProject.techStack
    : Array.isArray(fsProject.tech)
    ? fsProject.tech
    : [];
  const name: string = fsProject.name || fsProject.title || slug;
  const summary: string = fsProject.summary || fsProject.description || '';
  const category: string = fsProject.category || 'Web Application';
  const status: string = fsProject.status || 'Live Production';
  const score: number = Number(fsProject.lighthouseScore) || 99;
  const image: string = fsProject.image || '';
  const liveUrl: string = fsProject.url || '';

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen">
        <div className="container-site">
          {/* Hero Header */}
          <div className="max-w-4xl mb-12">
            <BlurReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-[rgba(255,255,255,0.08)] mb-4">
                <span className="text-xs font-mono text-[#06B6D4] uppercase tracking-wider">
                  {category}
                </span>
              </div>
            </BlurReveal>

            <TextReveal
              text={name}
              className="text-display-lg font-display font-black text-[#F8FAFC] mb-6"
              delay={0.2}
            />

            {summary && (
              <BlurReveal delay={0.35}>
                <p className="text-lg text-[#94A3B8] leading-relaxed">{summary}</p>
              </BlurReveal>
            )}
          </div>

          {/* Cover Image */}
          {image && (
            <BlurReveal delay={0.3}>
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-12 border border-[rgba(255,255,255,0.08)]">
                <Image
                  src={image}
                  alt={name}
                  fill
                  unoptimized={image.startsWith('data:')}
                  className="object-cover"
                />
              </div>
            </BlurReveal>
          )}

          {/* Key Metrics */}
          <BlurReveal delay={0.4}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-8 rounded-3xl glass border border-[rgba(255,255,255,0.08)] mb-12 bg-gradient-to-r from-[rgba(59,130,246,0.04)] to-transparent">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-display font-black gradient-text mb-1">
                  <CountUp end={score} suffix="/100" duration={2} />
                </div>
                <div className="text-xs font-mono text-[#64748B] uppercase tracking-wider">Lighthouse Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-display font-black text-[#10B981] mb-1">{status}</div>
                <div className="text-xs font-mono text-[#64748B] uppercase tracking-wider">Current Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-display font-black text-[#F8FAFC] mb-1">{techStack.length}</div>
                <div className="text-xs font-mono text-[#64748B] uppercase tracking-wider">Technologies Used</div>
              </div>
            </div>
          </BlurReveal>

          {/* Tech Stack */}
          {techStack.length > 0 && (
            <BlurReveal delay={0.5}>
              <div className="rounded-3xl glass p-8 border border-[rgba(255,255,255,0.08)] mb-12">
                <h3 className="font-display font-bold text-xl text-[#F8FAFC] mb-6">Tech Stack</h3>
                <div className="flex flex-wrap gap-3">
                  {techStack.map((t: string) => (
                    <span
                      key={t}
                      className="px-4 py-2 rounded-full text-xs font-mono bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.2)] text-[#60A5FA] font-semibold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </BlurReveal>
          )}

          {/* Live Demo Link */}
          {liveUrl && (
            <BlurReveal delay={0.55}>
              <div className="rounded-3xl glass p-8 border border-[rgba(59,130,246,0.2)] mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#F8FAFC] mb-1">View Live Project</h3>
                  <p className="text-xs font-mono text-[#64748B]">{liveUrl}</p>
                </div>
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] whitespace-nowrap"
                >
                  Open Live Demo →
                </a>
              </div>
            </BlurReveal>
          )}

          {/* Navigation CTA */}
          <div className="flex justify-between items-center pt-8 border-t border-[rgba(255,255,255,0.06)]">
            <Link href="/projects" className="text-xs font-mono text-[#94A3B8] hover:text-[#F8FAFC]">
              ← Back to All Projects
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
