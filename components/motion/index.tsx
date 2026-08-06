'use client';

import { useRef, useEffect, type ReactNode, type CSSProperties } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from '@/lib/gsap/plugins';
import { DURATION, EASE } from '@/lib/motion/tokens';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined)[]) {
  return twMerge(clsx(inputs));
}

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
  duration = 0.5,
  className,
  once = true,
}: BlurRevealProps) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-5%' }}
      transition={{ duration, delay, ease: EASE.premium }}
    >
      {children}
    </motion.div>
  );
}

// ─── WordReveal — staggered word animation ────────────────────────────────────
interface WordRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

export function WordReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.05,
  once = true,
}: WordRevealProps) {
  const reducedMotion = useReducedMotion();
  const words = text.split(' ');
  if (reducedMotion) return <span className={className}>{text}</span>;
  return (
    <span className={cn('inline-block', className)} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className={cn('inline-block', className, wordClassName)}
            initial={{ y: '115%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once, margin: '-10%' }}
            transition={{
              duration: DURATION.cinematic,
              delay: delay + i * stagger,
              ease: EASE.premium,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ─── GradientText ─────────────────────────────────────────────────────────────
interface GradientTextProps {
  children: ReactNode;
  from?: string;
  to?: string;
  via?: string;
  className?: string;
  animate?: boolean;
}

export function GradientText({
  children,
  from = '#60A5FA',
  to = '#8B5CF6',
  via,
  className = '',
  animate = false,
}: GradientTextProps) {
  const gradient = via
    ? `linear-gradient(135deg, ${from} 0%, ${via} 50%, ${to} 100%)`
    : `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
  return (
    <span
      className={cn(animate ? 'gradient-text' : '', className)}
      style={
        animate
          ? undefined
          : {
              background: gradient,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }
      }
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
  decimals?: number;
}

export function CountUp({
  end,
  duration = 2.4,
  prefix = '',
  suffix = '',
  className,
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reducedMotion) {
      ref.current.textContent = `${prefix}${end.toFixed(decimals)}${suffix}`;
      return;
    }
    const obj = { val: 0 };
    gsap.to(obj, {
      val: end,
      duration,
      ease: 'power3.out',
      onUpdate() {
        if (ref.current) {
          ref.current.textContent = `${prefix}${obj.val.toFixed(decimals)}${suffix}`;
        }
      },
    });
  }, [inView, end, duration, prefix, suffix, reducedMotion, decimals]);

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
  delay?: number;
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

// ─── TextReveal (word-by-word Framer) ─────────────────────────────────────────
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
  if (reducedMotion) return <p className={className}>{text}</p>;
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

// ─── GlassCard — animated glass card container ────────────────────────────────
interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'shimmer' | 'strong';
  glowColor?: string;
  delay?: number;
  style?: CSSProperties;
}

export function GlassCard({
  children,
  className,
  variant = 'default',
  delay = 0,
  style,
}: GlassCardProps) {
  const classes: Record<string, string> = {
    default: 'glass-card',
    shimmer: 'glass-shimmer',
    strong:  'glass-strong',
  };
  return (
    <motion.div
      className={cn(classes[variant], className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: DURATION.medium, delay, ease: EASE.premium }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── FadeUp — simple fade + translate-up ──────────────────────────────────────
interface FadeUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function FadeUp({
  children,
  className,
  delay = 0,
  duration = DURATION.medium,
  once = true,
}: FadeUpProps) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-8%' }}
      transition={{ duration, delay, ease: EASE.premium }}
    >
      {children}
    </motion.div>
  );
}

// ─── SlideIn — horizontal slide ───────────────────────────────────────────────
interface SlideInProps {
  children: ReactNode;
  from?: 'left' | 'right';
  className?: string;
  delay?: number;
  once?: boolean;
}

export function SlideIn({
  children,
  from = 'left',
  className,
  delay = 0,
  once = true,
}: SlideInProps) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: from === 'left' ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once, margin: '-8%' }}
      transition={{ duration: DURATION.slow, delay, ease: EASE.premium }}
    >
      {children}
    </motion.div>
  );
}
