'use client';

import { BlurReveal, TextReveal } from '@/components/motion';

const AI_WORKFLOW_STEPS = [
  { step: '01', title: 'Idea', icon: '💡', desc: 'Concept synthesis & narrative prompt design' },
  { step: '02', title: 'Script', icon: '📝', desc: 'LLM storytelling & voice timing breakdown' },
  { step: '03', title: 'Voice', icon: '🎙️', desc: 'Multilingual neural voiceover synthesis' },
  { step: '04', title: 'Storyboard', icon: '🖼️', desc: 'AI image seed & keyframe generation' },
  { step: '05', title: 'Animation', icon: '🎬', desc: 'Motion diffusion & camera trajectory control' },
  { step: '06', title: 'Editing', icon: '✂️', desc: 'Audio mixing, pacing, & color grading' },
  { step: '07', title: 'Final Film', icon: '🎥', desc: '4K cinematic export & distribution launch' },
];

export function SceneAIWorkflow() {
  return (
    <section
      id="scene-ai-workflow"
      data-scene="ai-workflow"
      className="section-padding relative overflow-hidden bg-gradient-to-b from-transparent via-[rgba(139,92,246,0.03)] to-transparent"
      aria-label="AI Video Workflow"
    >
      <div className="container-site">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <BlurReveal>
            <span className="text-xs font-mono text-[#8B5CF6] uppercase tracking-widest">
              / 06 — AI Video Pipeline
            </span>
          </BlurReveal>

          <TextReveal
            text="From raw prompt to 4K cinematic film."
            className="text-display-md font-display font-black text-[#F8FAFC] mt-3 mb-4"
            delay={0.2}
          />

          <BlurReveal delay={0.35}>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Our automated 7-step AI video engine transforms brand concepts into broadcast-quality commercials in under 48 hours.
            </p>
          </BlurReveal>
        </div>

        {/* 7-Step Horizontal Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 relative">
          {AI_WORKFLOW_STEPS.map((s, index) => (
            <BlurReveal key={s.step} delay={0.15 + index * 0.08}>
              <div className="group rounded-2xl glass p-5 border border-[rgba(255,255,255,0.08)] hover:border-[rgba(139,92,246,0.4)] hover:bg-[rgba(139,92,246,0.05)] transition-all duration-300 flex flex-col justify-between h-full relative">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-[#8B5CF6] font-bold">
                      {s.step}
                    </span>
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {s.icon}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-[#F8FAFC] mb-1 group-hover:text-[#A78BFA] transition-colors">
                    {s.title}
                  </h3>

                  <p className="text-[11px] text-[#94A3B8] leading-normal">
                    {s.desc}
                  </p>
                </div>

                {index < AI_WORKFLOW_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-[#8B5CF6] text-xs font-mono z-10 opacity-40">
                    →
                  </div>
                )}
              </div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
