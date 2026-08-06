'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useCursorState } from '@/providers/CursorProvider';
import { isTouchDevice } from '@/lib/utils';
import { SPRING } from '@/lib/motion/tokens';

const TRAIL_COUNT = 5;

// Per-state cursor config
const CURSOR_CONFIG = {
  idle:          { size: 8,  ringSize: 32, fill: false, label: '' },
  'hover-link':  { size: 6,  ringSize: 44, fill: true,  label: '' },
  'hover-button':{ size: 0,  ringSize: 40, fill: true,  label: '' },
  'hover-image': { size: 4,  ringSize: 52, fill: false, label: 'VIEW' },
  'hover-video': { size: 0,  ringSize: 52, fill: false, label: '▶' },
  drag:          { size: 8,  ringSize: 44, fill: false, label: '⟺' },
  progress:      { size: 4,  ringSize: 40, fill: false, label: '' },
  'page-nav':    { size: 4,  ringSize: 44, fill: false, label: '→' },
  hidden:        { size: 0,  ringSize: 0,  fill: false, label: '' },
} as const;

export function PremiumCursor() {
  const [mounted, setMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const { state, label } = useCursorState();

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
    if (isTouch) return;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      mx.set(e.clientX);
      my.set(e.clientY);
    };

    // Direct DOM manipulation — ultra-fast 60-120fps tracking
    const animateTrail = () => {
      const positions = trailPosRef.current;
      const target = posRef.current;

      for (let i = 0; i < TRAIL_COUNT; i++) {
        const prev = i === 0 ? target : positions[i - 1];
        positions[i].x += (prev.x - positions[i].x) * 0.65;
        positions[i].y += (prev.y - positions[i].y) * 0.65;

        const el = trailDotsRef.current[i];
        if (el) {
          el.style.transform = `translate3d(${positions[i].x - 3}px, ${positions[i].y - 3}px, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(animateTrail);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafRef.current = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isTouch, mx, my]);

  if (!mounted || isTouch) return null;

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

      {/* Cursor dot */}
      <motion.div
        className="absolute top-0 left-0 rounded-full bg-[#3B82F6] dark:bg-white pointer-events-none"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
        animate={{
          width: config.size,
          height: config.size,
          opacity: config.size === 0 ? 0 : 1,
        }}
        transition={SPRING.tight}
      />

      {/* Outer ring */}
      <motion.div
        className="absolute top-0 left-0 rounded-full border border-[rgba(59,130,246,0.7)] pointer-events-none"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          willChange: 'transform',
        }}
        animate={{
          width: config.ringSize,
          height: config.ringSize,
          opacity: config.ringSize === 0 ? 0 : 1,
          backgroundColor: config.fill
            ? 'rgba(59,130,246,0.15)'
            : 'rgba(59,130,246,0)',
          borderColor: config.fill
            ? 'rgba(59,130,246,0.9)'
            : 'rgba(59,130,246,0.7)',
        }}
        transition={SPRING.default}
      >
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
