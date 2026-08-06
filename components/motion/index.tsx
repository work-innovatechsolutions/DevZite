'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from '@/lib/gsap/plugins';
import { DURATION, EASE } from '@/lib/motion/tokens';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// ─── BlurReveal ───────────────────────────────────────────────────────────────
interface BlurRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function BlurReveal({
  children,
  delay = 0,
  duration = DURATION.slow,
  className,
  once = true,
}: BlurRevealProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-10%' }}
      transition={{ duration, delay, ease: EASE.premium }}
    >
      {children}
    </motion.div>
  );
}

// ─── GradientText ─────────────────────────────────────────────────────────────
interface GradientTextProps {
  children: ReactNode;
  from?: string;
  to?: string;
  className?: string;
}

export function GradientText({
  children,
  from = '#60A5FA',
  to = '#8B5CF6',
  className = '',
}: GradientTextProps) {
  return (
    <span
      className={className}
      style={{
        background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </span>
  );
}

// ─── CountUp ─────────────────────────────────────────────────────────────────
interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountUp({ end, duration = 2, prefix = '', suffix = '', className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reducedMotion) {
      ref.current.textContent = `${prefix}${end}${suffix}`;
      return;
    }

    const obj = { val: 0 };
    gsap.to(obj, {
      val: end,
      duration,
      ease: 'power2.out',
      onUpdate() {
        if (ref.current) {
          ref.current.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
        }
      },
    });
  }, [inView, end, duration, prefix, suffix, reducedMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

// ─── ScrambleText ──────────────────────────────────────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** Delay before starting scramble (ms) */
  delay?: number;
  /** Duration of scramble effect (ms) */
  duration?: number;
  trigger?: boolean;
}

export function ScrambleText({
  text,
  className,
  delay = 0,
  duration = 1200,
  trigger = true,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!trigger || !ref.current || reducedMotion) {
      if (ref.current) ref.current.textContent = text;
      return;
    }

    let frame = 0;
    const startTime = Date.now() + delay;

    const animate = () => {
      const now = Date.now();
      if (now < startTime) { requestAnimationFrame(animate); return; }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const settledCount = Math.floor(progress * text.length);

      if (ref.current) {
        ref.current.textContent = text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < settledCount) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');
      }

      if (progress < 1) { frame = requestAnimationFrame(animate); }
      else if (ref.current) { ref.current.textContent = text; }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [text, delay, duration, trigger, reducedMotion]);

  return <span ref={ref} className={className}>{text}</span>;
}

// ─── TextReveal (word by word) ────────────────────────────────────────────────
interface TextRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
}

export function TextReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
}: TextRevealProps) {
  const reducedMotion = useReducedMotion();
  const words = text.split(' ');

  if (reducedMotion) {
    return <p className={className}>{text}</p>;
  }

  return (
    <p className={cn('overflow-hidden', className)} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className={cn('inline-block', wordClassName)}
            initial={{ y: '110%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{
              duration: DURATION.slow,
              delay: delay + i * stagger,
              ease: EASE.premium,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </p>
  );
}

// ─── cn (local — avoids circular import) ─────────────────────────────────────
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...inputs: (string | undefined)[]) {
  return twMerge(clsx(inputs));
}
