import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal, TextReveal } from '@/components/motion';
import { SERVICE_DETAILS, SERVICE_SLUGS } from '@/lib/data/services';

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICE_DETAILS[slug];
  if (!service) return {};

  return {
    title: `${service.title} | Devzite`,
    description: `${service.tagline} — ${service.problem}`,
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title: `${service.title} | Devzite`,
      description: service.tagline,
      url: `/services/${slug}`,
    },
  };
}

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
