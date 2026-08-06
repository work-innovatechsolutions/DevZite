import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlurReveal, TextReveal } from '@/components/motion';

const LAB_EXPERIMENTS = [
  {
    id: 'exp-1',
    title: 'Shader Matrix Rain WebGL',
    category: 'R3F & Shaders',
    description: 'Custom GLSL fragment shader rendering interactive volumetric digital rain in real-time at 60fps.',
    tag: 'Interactive Demo',
    icon: '🧪',
    link: '#',
  },
  {
    id: 'exp-2',
    title: '7-Step AI Video Automation Pipeline',
    category: 'AI Pipeline',
    description: 'Automated script-to-4K video production pipeline integrating LLM text prompts, ElevenLabs audio, and Runway video gen.',
    tag: 'AI Experiment',
    icon: '🎬',
    link: '#',
  },
  {
    id: 'exp-3',
    title: 'Fluid Glassmorphic Motion Tokens',
    category: 'Design System',
    description: 'An open-source token system for glass surfaces, specular reflections, and spring-physics cursors.',
    tag: 'Open Source',
    icon: '💎',
    link: '#',
  },
  {
    id: 'exp-4',
    title: 'Realtime Multi-User Canvas Sync',
    category: 'Firebase WebSockets',
    description: 'Sub-20ms multi-cursor canvas sync built with Firebase Realtime Database and React 19 hooks.',
    tag: 'Prototype',
    icon: '⚡',
    link: '#',
  },
];

export default function LabPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 relative min-h-screen">
        <div className="container-site">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            <BlurReveal>
              <span className="text-xs font-mono text-[#06B6D4] uppercase tracking-widest">
                / Innovatech R&D Lab
              </span>
            </BlurReveal>

            <TextReveal
              text="Experiments, AI prototypes, and internal R&D."
              className="text-display-lg font-display font-black text-[#F8FAFC] mt-4 mb-6"
              delay={0.2}
            />

            <BlurReveal delay={0.35}>
              <p className="text-lg text-[#94A3B8] leading-relaxed">
                Welcome to Our Lab — a dedicated space where we explore cutting-edge WebGL shaders, automated AI video pipelines, open-source utilities, and speculative UX concepts.
              </p>
            </BlurReveal>
          </div>

          {/* Experiments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {LAB_EXPERIMENTS.map((exp, index) => (
              <BlurReveal key={exp.id} delay={0.2 + index * 0.1}>
                <div className="rounded-3xl glass p-8 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(6,182,212,0.3)] transition-all duration-300 relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl p-3 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
                      {exp.icon}
                    </span>
                    <span className="text-[11px] font-mono text-[#06B6D4] px-3 py-1 rounded-full glass border border-[rgba(6,182,212,0.2)]">
                      {exp.tag}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-[#64748B] block mb-1">
                    {exp.category}
                  </span>

                  <h3 className="font-display font-bold text-2xl text-[#F8FAFC] mb-3 group-hover:text-[#06B6D4] transition-colors">
                    {exp.title}
                  </h3>

                  <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                    {exp.description}
                  </p>

                  <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs font-mono text-[#3B82F6]">
                    <span>Run Prototype Demo</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </BlurReveal>
            ))}
          </div>

          {/* Open Source Callout */}
          <BlurReveal delay={0.6}>
            <div className="mt-16 rounded-3xl glass p-10 border border-[rgba(255,255,255,0.08)] text-center max-w-2xl mx-auto">
              <span className="text-3xl mb-3 block">🐙</span>
              <h3 className="font-display font-bold text-xl text-[#F8FAFC] mb-2">
                Open Source & Research
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-6">
                We regularly open-source internal tooling, motion token libraries, and Firebase security rules snippets to support the developer ecosystem.
              </p>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full glass text-xs font-mono text-[#F8FAFC] hover:text-[#3B82F6]"
              >
                Browse GitHub Repositories →
              </a>
            </div>
          </BlurReveal>
        </div>
      </main>

      <Footer />
    </>
  );
}
