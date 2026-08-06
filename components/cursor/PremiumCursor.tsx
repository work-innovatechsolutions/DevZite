'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useCursorState } from '@/providers/CursorProvider';
import { isTouchDevice } from '@/lib/utils';
import { SPRING } from '@/lib/motion/tokens';

const TRAIL_COUNT = 6;

interface TrailDot {
  x: number;
  y: number;
}

// Per-state cursor config
const CURSOR_CONFIG = {
  idle:          { size: 8,  ringSize: 32, fill: false, label: '' },
  'hover-link':  { size: 6,  ringSize: 48, fill: true,  label: '' },
  'hover-button':{ size: 0,  ringSize: 40, fill: true,  label: '' },
  'hover-image': { size: 4,  ringSize: 56, fill: false, label: 'VIEW' },
  'hover-video': { size: 0,  ringSize: 56, fill: false, label: '▶' },
  drag:          { size: 8,  ringSize: 48, fill: false, label: '⟺' },
  progress:      { size: 4,  ringSize: 40, fill: false, label: '' },
  'page-nav':    { size: 4,  ringSize: 48, fill: false, label: '→' },
  hidden:        { size: 0,  ringSize: 0,  fill: false, label: '' },
} as const;

export function PremiumCursor() {
  const [mounted, setMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const { state, label } = useCursorState();
  const [trail, setTrail] = useState<TrailDot[]>(
    Array(TRAIL_COUNT).fill({ x: -100, y: -100 })
  );
  const posRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef<TrailDot[]>(Array(TRAIL_COUNT).fill({ x: -100, y: -100 }));
  const rafRef = useRef<number>(0);

  // Spring-based cursor position
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const springX = useSpring(mx, SPRING.tight);
  const springY = useSpring(my, SPRING.tight);

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

    // Animate trail with RAF
    const animateTrail = () => {
      const prev = trailRef.current;
      trailRef.current = prev.map((dot, i) => {
        if (i === 0) {
          return {
            x: dot.x + (posRef.current.x - dot.x) * 0.35,
            y: dot.y + (posRef.current.y - dot.y) * 0.35,
          };
        }
        return {
          x: dot.x + (prev[i - 1].x - dot.x) * 0.35,
          y: dot.y + (prev[i - 1].y - dot.y) * 0.35,
        };
      });
      setTrail([...trailRef.current]);
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
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 500 }}
      aria-hidden="true"
    >
      {/* Trail dots */}
      {trail.map((dot, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#3B82F6] transition-opacity"
          style={{
            width: Math.max(2, 6 - i),
            height: Math.max(2, 6 - i),
            opacity: (TRAIL_COUNT - i) / TRAIL_COUNT * 0.4,
            transform: `translate(${dot.x - (3 - i * 0.5)}px, ${dot.y - (3 - i * 0.5)}px)`,
            willChange: 'transform',
          }}
        />
      ))}

      {/* Cursor dot */}
      <motion.div
        className="absolute rounded-full bg-white"
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
        className="absolute rounded-full border border-[rgba(59,130,246,0.7)]"
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
              className="absolute inset-0 flex items-center justify-center text-[10px] font-body font-semibold text-white tracking-widest"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
            >
              {displayLabel}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/**
 * Wraps children and sets cursor state on hover.
 * Usage: <CursorTarget state="hover-image">...</CursorTarget>
 */
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
