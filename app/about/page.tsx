import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal, TextReveal } from '@/components/motion';

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen">
        <div className="container-site max-w-4xl">
          {/* Header */}
          <div className="mb-16">
            <BlurReveal>
              <span className="text-xs font-mono text-[#3B82F6] uppercase tracking-widest font-semibold block mb-2">
                / 07 — Who We Are & Manifesto
              </span>
            </BlurReveal>

            <BlurReveal delay={0.15}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC] mb-4 leading-tight">
                Architects of digital experiences that{' '}
                <span className="text-[#3B82F6] inline-block">move people.</span>
              </h1>
            </BlurReveal>

            <BlurReveal delay={0.3}>
              <p className="text-lg sm:text-xl text-[#334155] dark:text-[#CBD5E1] leading-relaxed font-body font-medium">
                DevZite was founded on a simple premise: web applications should be blindingly fast, visually unforgettable, and engineered to scale seamlessly.
              </p>
            </BlurReveal>
          </div>

          {/* Manifesto Callout */}
          <BlurReveal delay={0.45}>
            <div className="p-8 rounded-3xl glass border border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.02)] mb-16">
              <h2 className="text-xs font-mono text-[#06B6D4] uppercase tracking-wider mb-3">
                Our Brand Manifesto
              </h2>
              <p className="text-base text-[#F8FAFC] italic font-serif leading-relaxed space-y-3">
                &ldquo;We don&apos;t make websites. We craft digital worlds. Not everything that loads fast looks good. Not everything that looks good loads fast. We refuse to choose. We are DevZite. We build both.&rdquo;
              </p>
            </div>
          </BlurReveal>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            {[
              { label: 'Projects Shipped', value: '47+' },
              { label: 'Client Retention', value: '98%' },
              { label: 'Global Edge Regions', value: '300+' },
            ].map((stat, i) => (
              <BlurReveal key={stat.label} delay={0.5 + i * 0.1}>
                <div className="rounded-2xl glass p-6 border border-[rgba(255,255,255,0.08)] text-center">
                  <div className="text-3xl font-display font-black gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs font-mono text-[#64748B] uppercase tracking-wider">
                    {stat.label}
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
