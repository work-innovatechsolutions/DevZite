'use client';

import { useEffect, useRef } from 'react';

/**
 * ScrollProgress
 * Thin gradient progress bar fixed to top of viewport.
 * Driven on scroll events with requestAnimationFrame throttling (0 continuous RAF loops).
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    let maxScroll = 1;

    const updateMaxScroll = () => {
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    updateMaxScroll();

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const progress = Math.min(scrollY / maxScroll, 1);
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${progress})`;
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateMaxScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateMaxScroll);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#8B5CF6] z-[1000] pointer-events-none origin-left transition-transform duration-75 ease-out shadow-[0_0_8px_rgba(59,130,246,0.8)] [will-change:transform]"
      role="progressbar"
      aria-label="Page scroll progress"
    />
  );
}
