'use client';

import { useRef, type ReactNode, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { SPRING } from '@/lib/motion/tokens';
import { isTouchDevice } from '@/lib/utils';

interface MagneticWrapperProps {
  children: ReactNode;
  strength?: number;    // 0–1, how strong the pull is
  className?: string;
}

/**
 * Wraps any element with a magnetic pull effect.
 * On hover, the element is pulled toward the cursor.
 */
export function MagneticWrapper({
  children,
  strength = 0.4,
  className,
}: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING.default);
  const springY = useSpring(y, SPRING.default);

  const handleMouseEnter = () => {
    if (isTouchDevice() || !ref.current) return;
    rectRef.current = ref.current.getBoundingClientRect();
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice()) return;
    if (!rectRef.current && ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
