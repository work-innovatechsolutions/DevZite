/**
 * Design Governance Token System
 * Single source of truth for ALL design decisions.
 * Rule: Never use raw values — always reference DESIGN.*
 */

export const DESIGN = {
  // ─── Colors ────────────────────────────────────────────────────────────────
  color: {
    bg: {
      base:     '#06070A',
      surface:  '#0C0D14',
      elevated: '#11121C',
    },
    accent: {
      blue:   '#3B82F6',
      cyan:   '#06B6D4',
      violet: '#8B5CF6',
    },
    text: {
      primary:   '#F8FAFC',
      secondary: '#94A3B8',
      muted:     '#64748B',
    },
    glass: {
      bg:     'rgba(255, 255, 255, 0.03)',
      bgHover: 'rgba(255, 255, 255, 0.06)',
      border: 'rgba(255, 255, 255, 0.08)',
      borderHover: 'rgba(255, 255, 255, 0.16)',
    },
    glow: {
      blue:   'rgba(59, 130, 246, 0.20)',
      cyan:   'rgba(6, 182, 212, 0.15)',
      violet: 'rgba(139, 92, 246, 0.15)',
    },
  },

  // ─── Spacing ────────────────────────────────────────────────────────────────
  space: {
    xs:   '0.25rem',   //  4px
    sm:   '0.5rem',    //  8px
    md:   '1rem',      // 16px
    lg:   '1.5rem',    // 24px
    xl:   '2rem',      // 32px
    '2xl': '3rem',     // 48px
    '3xl': '4rem',     // 64px
    '4xl': '6rem',     // 96px
    '5xl': '8rem',     // 128px
    section: 'clamp(5rem, 10vw, 10rem)', // responsive section padding
  },

  // ─── Border Radius ─────────────────────────────────────────────────────────
  radius: {
    sm:   '0.375rem',  //  6px
    md:   '0.5rem',    //  8px
    lg:   '0.75rem',   // 12px
    xl:   '1rem',      // 16px
    '2xl': '1.5rem',   // 24px
    '3xl': '2rem',     // 32px
    full: '9999px',
  },

  // ─── Blur Levels ───────────────────────────────────────────────────────────
  blur: {
    sm:   'blur(4px)',
    md:   'blur(8px)',
    lg:   'blur(16px)',
    xl:   'blur(24px)',
    '2xl': 'blur(40px)',
    '3xl': 'blur(64px)',
  },

  // ─── Shadow Levels ─────────────────────────────────────────────────────────
  shadow: {
    sm:   '0 1px 2px rgba(0, 0, 0, 0.4)',
    md:   '0 4px 12px rgba(0, 0, 0, 0.5)',
    lg:   '0 8px 24px rgba(0, 0, 0, 0.6)',
    xl:   '0 16px 48px rgba(0, 0, 0, 0.7)',
    glow: {
      blue:   '0 0 24px rgba(59, 130, 246, 0.4)',
      cyan:   '0 0 24px rgba(6, 182, 212, 0.3)',
      violet: '0 0 24px rgba(139, 92, 246, 0.3)',
    },
  },

  // ─── Glow Intensity ────────────────────────────────────────────────────────
  glow: {
    none:   0,
    subtle: 0.10,
    soft:   0.20,
    medium: 0.35,
    strong: 0.55,
    intense: 0.80,
  },

  // ─── Z-Index ───────────────────────────────────────────────────────────────
  zIndex: {
    base:      0,
    elevated:  10,
    dropdown:  100,
    sticky:    200,
    overlay:   300,
    modal:     400,
    cursor:    500,
    loader:    600,
    tooltip:   700,
    toast:     800,
  },

  // ─── Opacity ───────────────────────────────────────────────────────────────
  opacity: {
    ghost:   0.03,
    subtle:  0.08,
    muted:   0.20,
    dim:     0.40,
    mid:     0.60,
    high:    0.80,
    full:    1.00,
  },

  // ─── Glass Styles (pre-composed) ───────────────────────────────────────────
  glass: {
    default: {
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    },
    subtle: {
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
    },
    strong: {
      background: 'rgba(255, 255, 255, 0.06)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255, 255, 255, 0.12)',
    },
    nav: {
      background: 'rgba(6, 7, 10, 0.80)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
    },
  },

  // ─── Animation Motion Budget (per scene) ───────────────────────────────────
  // Defines MAX allowed motion intensity for each scene.
  // 0 = none, 1 = minimal, 2 = restrained, 3 = moderate, 4 = rich, 5 = max
  sceneBudget: {
    arrival:    5, // Hero — maximum motion
    identity:   3, // Who we are — moderate
    problems:   3, // Services — moderate
    process:    3, // Process — moderate (horizontal scroll is the focus)
    proof:      4, // Projects — rich (cinematic, but content-first)
    numbers:    2, // Stats — restrained
    voices:     2, // Testimonials — restrained
    gallery:    2, // Gallery — restrained (content is the motion)
    invitation: 1, // Contact — calm
  },

  // ─── Performance Budgets ───────────────────────────────────────────────────
  budget: {
    initialJS:   250 * 1024, // 250 KB
    heroImage:   300 * 1024, // 300 KB
    lcpImage:    180 * 1024, // 180 KB
    fonts:       120 * 1024, // 120 KB
    // R3F bundle loaded only when required (dynamic import)
  },
} as const;

export type DesignToken = typeof DESIGN;
