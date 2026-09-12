'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useMotionValue, useSpring, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useCursorState } from '@/providers/CursorProvider';
import { isTouchDevice } from '@/lib/utils';
import { SPRING } from '@/lib/motion/tokens';

const TRAIL_COUNT = 5;

// Per-state cursor config with pre-calculated transform scale
const CURSOR_CONFIG = {
  idle:          { scale: 1,    ringScale: 1,      fill: false, label: '' },
  'hover-link':  { scale: 0.75, ringScale: 1.375,  fill: true,  label: '' },
  'hover-button':{ scale: 0,    ringScale: 1.25,   fill: true,  label: '' },
  'hover-image': { scale: 0.5,  ringScale: 1.625,  fill: false, label: 'VIEW' },
  'hover-video': { scale: 0,    ringScale: 1.625,  fill: false, label: '▶' },
  drag:          { scale: 1,    ringScale: 1.375,  fill: false, label: '⟺' },
  progress:      { scale: 0.5,  ringScale: 1.25,   fill: false, label: '' },
  'page-nav':    { scale: 0.5,  ringScale: 1.375,  fill: false, label: '→' },
  hidden:        { scale: 0,    ringScale: 0,      fill: false, label: '' },
} as const;

export function PremiumCursor() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const { state, label } = useCursorState();
  const shouldReduceMotion = useReducedMotion();

  const isDisabledPanel = Boolean(
    pathname && (pathname.startsWith('/admin') || pathname.startsWith('/client'))
  );

  const posRef = useRef({ x: -100, y: -100 });
  const trailDotsRef = useRef<HTMLDivElement[]>([]);
  const trailPosRef = useRef(Array(TRAIL_COUNT).fill(null).map(() => ({ x: -100, y: -100 })));
  const rafRef = useRef<number>(0);

  // High-stiffness, ultra-fast responsive cursor spring position
  const FAST_SPRING = { stiffness: 1000, damping: 45, mass: 0.1 };
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const springX = useSpring(mx, FAST_SPRING);
  const springY = useSpring(my, FAST_SPRING);

  const config = CURSOR_CONFIG[state] ?? CURSOR_CONFIG.idle;
  const displayLabel = label || config.label;

  useEffect(() => {
    setMounted(true);
    setIsTouch(isTouchDevice());
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isDisabledPanel) {
      document.body.classList.add('custom-cursor-disabled');
    } else {
      document.body.classList.remove('custom-cursor-disabled');
    }
  }, [isDisabledPanel]);

  useEffect(() => {
    if (isTouch || shouldReduceMotion) return;

    let isRunning = false;

    // Direct DOM manipulation with idle equilibrium check
    const animateTrail = () => {
      const positions = trailPosRef.current;
      const target = posRef.current;
      let needsMoreFrames = false;

      for (let i = 0; i < TRAIL_COUNT; i++) {
        const prev = i === 0 ? target : positions[i - 1];
        const dx = prev.x - positions[i].x;
        const dy = prev.y - positions[i].y;

        positions[i].x += dx * 0.65;
        positions[i].y += dy * 0.65;

        if (Math.abs(dx) > 0.2 || Math.abs(dy) > 0.2) {
          needsMoreFrames = true;
        }

        const el = trailDotsRef.current[i];
        if (el) {
          el.style.transform = `translate3d(${positions[i].x - 3}px, ${positions[i].y - 3}px, 0)`;
        }
      }

      if (needsMoreFrames) {
        rafRef.current = requestAnimationFrame(animateTrail);
      } else {
        isRunning = false;
      }
    };

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      mx.set(e.clientX);
      my.set(e.clientY);

      if (!isRunning) {
        isRunning = true;
        rafRef.current = requestAnimationFrame(animateTrail);
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isTouch, shouldReduceMotion, mx, my]);

  if (!mounted || isTouch || isDisabledPanel || shouldReduceMotion) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden="true"
    >
      {/* Trail dots — Direct DOM styled */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailDotsRef.current[i] = el; }}
          className="absolute top-0 left-0 rounded-full bg-[#3B82F6] pointer-events-none"
          style={{
            width: Math.max(2, 5 - i),
            height: Math.max(2, 5 - i),
            opacity: ((TRAIL_COUNT - i) / TRAIL_COUNT) * 0.4,
            transform: 'translate3d(-100px, -100px, 0)',
            willChange: 'transform',
          }}
        />
      ))}

      {/* Cursor dot — GPU transform scale instead of width/height */}
      <motion.div
        className="absolute top-0 left-0 w-2 h-2 rounded-full bg-[#3B82F6] dark:bg-white pointer-events-none"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
        animate={{
          scale: config.scale,
          opacity: config.scale === 0 ? 0 : 1,
        }}
        transition={SPRING.tight}
      />

      {/* Outer ring — GPU transform scale & layered opacity */}
      <motion.div
        className="absolute top-0 left-0 w-8 h-8 rounded-full pointer-events-none"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
        animate={{
          scale: config.ringScale,
          opacity: config.ringScale === 0 ? 0 : 1,
        }}
        transition={SPRING.default}
      >
        {/* Unfilled border */}
        <div
          className="absolute inset-0 rounded-full border border-[rgba(59,130,246,0.7)] transition-opacity duration-200"
          style={{ opacity: config.fill ? 0 : 1 }}
        />
        {/* Filled state */}
        <div
          className="absolute inset-0 rounded-full bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.9)] transition-opacity duration-200"
          style={{ opacity: config.fill ? 1 : 0 }}
        />

        {/* Label inside ring */}
        <AnimatePresence>
          {displayLabel && (
            <motion.span
              key={displayLabel}
              className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-semibold text-white tracking-wider"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.12 }}
            >
              {displayLabel}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

interface CursorTargetProps {
  state: keyof typeof CURSOR_CONFIG;
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export function CursorTarget({ state, label = '', children, className }: CursorTargetProps) {
  const { setState, setLabel } = useCursorState();

  return (
    <div
      className={className}
      onMouseEnter={() => { setState(state); setLabel(label); }}
      onMouseLeave={() => { setState('idle'); setLabel(''); }}
    >
      {children}
    </div>
  );
}
