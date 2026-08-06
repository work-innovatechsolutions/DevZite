'use client';

import { useEffect } from 'react';
import { gsap } from '@/lib/gsap/plugins';

/**
 * ScrollProgress
 * Thin gradient progress bar fixed to top of viewport.
 * Uses GSAP ScrollTrigger to update --scroll-progress CSS var.
 * The bar width is driven by CSS: width = calc(var(--scroll-progress) * 100%)
 */
export function ScrollProgress() {
  useEffect(() => {
    // Use requestAnimationFrame for smooth, low-overhead updates
    let raf: number;

    const update = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
      document.documentElement.style.setProperty('--scroll-progress', String(progress));
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="scroll-progress-bar"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
