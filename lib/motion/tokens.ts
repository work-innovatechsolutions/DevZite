/**
 * Motion Token System
 * Single source of truth for ALL animation decisions.
 *
 * Rule: Every animation in the codebase references MOTION.* — never raw values.
 *
 * Easings guide:
 *  standard   → general UI transitions
 *  decelerate → elements entering the viewport (feel like they land)
 *  accelerate → elements leaving the viewport (feel like they leave)
 *  elastic    → GSAP bouncy interactions
 *  premium    → expo-out feel — snappy start, elegant settle
 *  luxury     → slow, weighty, dramatic reveals
 *  spring     → Framer Motion spring (natural physics)
 *  springTight→ Framer Motion tight spring (snappy, precise)
 */

// ─── Framer Motion compatible (arrays = cubic-bezier) ─────────────────────
export const EASE = {
  standard:    [0.4, 0.0, 0.2, 1.0]   as [number, number, number, number],
  decelerate:  [0.0, 0.0, 0.2, 1.0]   as [number, number, number, number],
  accelerate:  [0.4, 0.0, 1.0, 1.0]   as [number, number, number, number],
  premium:     [0.16, 1.0, 0.3, 1.0]  as [number, number, number, number],
  luxury:      [0.76, 0.0, 0.24, 1.0] as [number, number, number, number],
} as const;

// ─── Framer Motion spring configs ─────────────────────────────────────────
export const SPRING = {
  default:  { type: 'spring' as const, stiffness: 100, damping: 15 },
  tight:    { type: 'spring' as const, stiffness: 300, damping: 30 },
  bouncy:   { type: 'spring' as const, stiffness: 200, damping: 10 },
  slow:     { type: 'spring' as const, stiffness: 60,  damping: 20 },
} as const;

// ─── GSAP easings (string format) ─────────────────────────────────────────
export const GSAP_EASE = {
  standard:   'power2.inOut',
  decelerate: 'power3.out',
  accelerate: 'power3.in',
  elastic:    'elastic.out(1, 0.3)',
  premium:    'expo.out',
  luxury:     'power4.inOut',
  bounce:     'bounce.out',
} as const;

// ─── Duration presets (seconds) ───────────────────────────────────────────
export const DURATION = {
  instant:   0.1,  // Micro-interactions, button hover states
  fast:      0.2,  // UI feedback, tooltips, badges
  medium:    0.4,  // Panel transitions, dropdowns
  slow:      0.7,  // Section reveals, card entrances
  cinematic: 1.2,  // Hero elements, page transitions
  luxury:    2.0,  // Loader reveals, dramatic moments
} as const;

// ─── Stagger presets (seconds between each child) ─────────────────────────
export const STAGGER = {
  tight:  0.03,   // Dense lists
  normal: 0.06,   // Cards, nav items
  loose:  0.12,   // Section features
  slow:   0.20,   // Dramatic reveals
} as const;

// ─── Viewport settings for Framer Motion whileInView ──────────────────────
export const VIEWPORT = {
  once: true,
  margin: '-10%',
} as const;

// ─── Composed MOTION object (convenience) ─────────────────────────────────
export const MOTION = {
  duration: DURATION,
  ease:     EASE,
  spring:   SPRING,
  gsapEase: GSAP_EASE,
  stagger:  STAGGER,
  viewport: VIEWPORT,
} as const;

// ─── Reusable Framer Motion variants ──────────────────────────────────────
export const VARIANTS = {
  fadeUp: {
    hidden:  { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE.decelerate } },
  },
  fadeIn: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: DURATION.medium, ease: EASE.standard } },
  },
  blurUp: {
    hidden:  { opacity: 0, y: 32, filter: 'blur(12px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: DURATION.slow, ease: EASE.premium } },
  },
  scaleIn: {
    hidden:  { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: DURATION.medium, ease: EASE.premium } },
  },
  slideLeft: {
    hidden:  { opacity: 0, x: 48 },
    visible: { opacity: 1, x: 0, transition: { duration: DURATION.slow, ease: EASE.decelerate } },
  },
  slideRight: {
    hidden:  { opacity: 0, x: -48 },
    visible: { opacity: 1, x: 0, transition: { duration: DURATION.slow, ease: EASE.decelerate } },
  },
  staggerContainer: {
    hidden:  {},
    visible: { transition: { staggerChildren: STAGGER.normal, delayChildren: 0.1 } },
  },
  staggerFast: {
    hidden:  {},
    visible: { transition: { staggerChildren: STAGGER.tight, delayChildren: 0.05 } },
  },
} as const;

export type MotionToken = typeof MOTION;
