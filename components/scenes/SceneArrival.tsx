'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WordReveal, BlurReveal, CountUp, GradientText } from '@/components/motion';
import { useCursorState } from '@/providers/CursorProvider';
import { DURATION, EASE } from '@/lib/motion/tokens';

const STATS = [
  { value: 47,  suffix: '+',  label: 'Projects' },
  { value: 98,  suffix: '%',  label: 'Retention' },
  { value: 24,  suffix: '/7', label: 'Support'   },
];

export function SceneArrival() {
  const { setState } = useCursorState();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false); // default: unmuted

  // Attempt autoplay with audio; browsers may block it — fall back to muted silently
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.play().catch(() => {
      // Browser blocked autoplay with audio — fall back to muted
      video.muted = true;
      setIsMuted(true);
      video.play().catch(() => {});
    });
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !isMuted;
    video.muted = next;
    setIsMuted(next);
  };

  return (
    <section
      id="scene-arrival"
      data-scene="arrival"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20"
      aria-label="Hero — Innovatech Solutions"
    >
      {/* ── Background video aligned directly below navbar ── */}
      <div className="absolute inset-x-0 top-20 bottom-0 z-0 pointer-events-none overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover object-top opacity-85"
          src="/video3.mp4"
          loop
          playsInline
          preload="auto"
          aria-label="Innovatech Solutions showreel"
        />
      </div>

      {/* ── Multi-layer overlay for readability & atmosphere ── */}
      <div
        className="absolute inset-x-0 top-20 bottom-0 z-[1] pointer-events-none"
        style={{ background: 'rgba(6, 7, 10, 0.55)' }}
      />
      {/* Bottom gradient fade into page background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-[2] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #06070A)' }}
      />
      {/* Top gradient overlay under navbar */}
      <div
        className="absolute top-20 left-0 right-0 h-28 z-[2] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(6,7,10,0.8), transparent)' }}
      />
      {/* Radial center glow */}
      <div
        className="absolute inset-x-0 top-20 bottom-0 z-[2] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(59,130,246,0.12) 0%, transparent 70%)',
        }}
      />

      {/* ── Mute / Unmute Toggle Button (Fixed inside Hero bottom-right) ── */}
      <button
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        className="absolute bottom-8 right-8 z-30 flex items-center gap-2.5 px-4 py-2.5 rounded-full glass-strong border border-[rgba(255,255,255,0.18)] text-xs font-mono text-[#F8FAFC] hover:border-[rgba(59,130,246,0.6)] hover:text-[#60A5FA] transition-all duration-300 backdrop-blur-xl shadow-2xl group cursor-pointer"
      >
        {isMuted ? (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#94A3B8] group-hover:text-[#60A5FA]">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
            <span>Unmute Sound</span>
          </>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3B82F6] animate-pulse">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <span>Audio On</span>
          </>
        )}
      </button>

      {/* ── Hero Content (Centered) ── */}
      <div className="container-site relative z-10 text-center py-16 flex flex-col items-center">

        {/* Terminal eyebrow badge */}
        <BlurReveal delay={0.1}>
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border border-[rgba(255,255,255,0.1)] mb-10 shadow-2xl">
            <span className="w-1.5 h-1.5 rounded-full bg-[#27C93F] animate-pulse" />
            <span className="terminal-text terminal-cursor text-[11px]">
              // innovatech.solutions — v3.0 live
            </span>
          </div>
        </BlurReveal>

        {/* Main headline */}
        <h1 className="text-display-xl font-display font-black mb-6 tracking-tight max-w-5xl mx-auto">
          <WordReveal
            text="We Build Digital"
            className="block text-[#F8FAFC] mb-1"
            delay={0.2}
            stagger={0.06}
          />
          <WordReveal
            text="Experiences That"
            className="block mb-1"
            wordClassName="gradient-text"
            delay={0.38}
            stagger={0.06}
          />
          <WordReveal
            text="People Remember."
            className="block text-[#F8FAFC]"
            delay={0.56}
            stagger={0.06}
          />
        </h1>

        {/* Sub-headline */}
        <BlurReveal delay={0.72}>
          <p className="text-base sm:text-lg lg:text-xl text-[#CBD5E1] max-w-2xl mx-auto mb-12 leading-relaxed font-body">
            We craft cinematic websites, web apps, Android experiences, AI-generated video, and content platforms that put your brand{' '}
            <GradientText from="#60A5FA" to="#06B6D4">on another level.</GradientText>
          </p>
        </BlurReveal>

        {/* CTAs */}
        <BlurReveal delay={0.88}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#scene-proof"
              id="hero-cta-work"
              onMouseEnter={() => setState('hover-button')}
              onMouseLeave={() => setState('idle')}
              className="btn-primary text-base px-9 py-4 shadow-[0_0_40px_rgba(59,130,246,0.35)]"
            >
              See Our Work
              <motion.span
                className="inline-block"
                whileHover={{ x: 4 }}
                transition={{ duration: DURATION.fast, ease: EASE.standard }}
              >
                →
              </motion.span>
            </a>
            <a
              href="#scene-invitation"
              id="hero-cta-project"
              onMouseEnter={() => setState('hover-button')}
              onMouseLeave={() => setState('idle')}
              className="btn-ghost text-base px-9 py-4"
            >
              Start a Project
            </a>
          </div>
        </BlurReveal>

        {/* Live stat counters */}
        <BlurReveal delay={1.05}>
          <div className="mt-20 flex items-center justify-center gap-10 sm:gap-16 border-t border-[rgba(255,255,255,0.1)] pt-8">
            {STATS.map(({ value, suffix, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl sm:text-4xl font-display font-black gradient-text">
                  <CountUp end={value} suffix={suffix} duration={2.2} />
                </div>
                <div className="text-[10px] text-[#94A3B8] font-mono mt-1.5 uppercase tracking-[0.2em]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </BlurReveal>

        {/* Scroll hint */}
        <BlurReveal delay={1.4}>
          <div className="mt-12 flex flex-col items-center gap-2 opacity-50">
            <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-widest">Scroll</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="w-5 h-8 rounded-full border border-[rgba(255,255,255,0.25)] flex items-start justify-center pt-1.5"
            >
              <div className="w-1 h-1.5 rounded-full bg-[rgba(255,255,255,0.6)]" />
            </motion.div>
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}
