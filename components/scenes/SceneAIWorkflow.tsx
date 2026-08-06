'use client';

import { motion } from 'framer-motion';
import { BlurReveal, WordReveal, SlideIn } from '@/components/motion';
import { DURATION, EASE } from '@/lib/motion/tokens';

const AI_WORKFLOW_STEPS = [
  { step: '01', title: 'Idea',       icon: '💡', desc: 'Concept synthesis & narrative prompt design',            color: '#3B82F6' },
  { step: '02', title: 'Script',     icon: '📝', desc: 'LLM storytelling & voice timing breakdown',              color: '#06B6D4' },
  { step: '03', title: 'Voice',      icon: '🎙️', desc: 'Multilingual neural voiceover synthesis',               color: '#8B5CF6' },
  { step: '04', title: 'Storyboard', icon: '🖼️', desc: 'AI image seed & keyframe generation',                  color: '#6366F1' },
  { step: '05', title: 'Animation',  icon: '🎬', desc: 'Motion diffusion & camera trajectory control',           color: '#A855F7' },
  { step: '06', title: 'Editing',    icon: '✂️', desc: 'Audio mixing, pacing, & color grading',                 color: '#EC4899' },
  { step: '07', title: 'Final Film', icon: '🎥', desc: '4K cinematic export & distribution launch',              color: '#F59E0B' },
];

export function SceneAIWorkflow() {
  return (
    <section
      id="scene-ai-workflow"
      data-scene="ai-workflow"
      className="section-padding relative overflow-hidden"
      aria-label="AI Video Production Workflow"
      style={{
        background:
          'linear-gradient(to bottom, transparent, rgba(139,92,246,0.04) 50%, transparent)',
      }}
    >
      <div className="container-site">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <BlurReveal>
            <span className="text-xs font-mono text-[#8B5CF6] uppercase tracking-widest">
              / 05 — AI Video Pipeline
            </span>
          </BlurReveal>

          <h2 className="text-display-md font-display font-black text-[#F8FAFC] mt-4 mb-5">
            <WordReveal text="From raw prompt to" delay={0.15} stagger={0.05} className="block" />
            <WordReveal
              text="4K cinematic film."
              delay={0.35}
              stagger={0.05}
              className="block gradient-text-violet"
              wordClassName="gradient-text-violet"
            />
          </h2>

          <BlurReveal delay={0.45}>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Our automated 7-step AI video engine transforms brand concepts into broadcast-quality
              commercials in under 48 hours.
            </p>
          </BlurReveal>
        </div>

        {/* Alternating vertical pipeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Center connector line */}
          <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px hidden md:block">
            <div className="h-full workflow-line opacity-30" />
          </div>

          <div className="space-y-8">
            {AI_WORKFLOW_STEPS.map((s, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={s.step}
                  className={`flex items-center gap-6 md:gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-8%' }}
                  transition={{ duration: DURATION.slow, delay: i * 0.1, ease: EASE.premium }}
                >
                  {/* Card (takes 5/12 width on md) */}
                  <div className={`flex-1 md:w-5/12 ${isLeft ? 'md:pr-10 md:text-right' : 'md:pl-10'}`}>
                    <div className="group glass-card rounded-2xl p-6 hover:border-[rgba(139,92,246,0.4)] relative overflow-hidden">
                      {/* Accent glow */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                        style={{ background: `radial-gradient(ellipse at ${isLeft ? '100%' : '0%'} 50%, ${s.color}12 0%, transparent 60%)` }}
                      />
                      <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:flex-row-reverse md:justify-start' : ''}`}>
                        <span
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                          style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}
                        >
                          {s.icon}
                        </span>
                        <h3 className="font-display font-bold text-lg text-[#F8FAFC]">{s.title}</h3>
                      </div>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">{s.desc}</p>
                    </div>
                  </div>

                  {/* Center node */}
                  <div className="hidden md:flex flex-col items-center justify-center w-2/12 z-10">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-mono font-bold border-2 relative"
                      style={{
                        borderColor: s.color,
                        color: s.color,
                        background: '#06070A',
                        boxShadow: `0 0 20px ${s.color}40`,
                      }}
                    >
                      {s.step}
                    </div>
                  </div>

                  {/* Opposite spacer */}
                  <div className="hidden md:block flex-1 w-5/12" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom turnaround banner */}
        <SlideIn from="left" delay={0.5} className="mt-20">
          <div className="glass-card rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-l-2 border-[#8B5CF6] relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 0% 50%, rgba(139,92,246,0.07) 0%, transparent 60%)' }}
            />
            <div className="relative z-10">
              <p className="font-display font-bold text-xl text-[#F8FAFC] mb-1">48-hour turnaround</p>
              <p className="text-sm text-[#94A3B8]">From prompt to broadcast-ready 4K cinematic video.</p>
            </div>
            <a
              href="#scene-invitation"
              className="btn-primary shrink-0 relative z-10"
              id="workflow-cta"
            >
              Launch a Video Project →
            </a>
          </div>
        </SlideIn>
      </div>
    </section>
  );
}
