'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Command } from 'lucide-react';
import { gsap } from '@/lib/gsap/plugins';
import { MagneticWrapper } from '@/components/cursor/MagneticWrapper';
import { useCursorState } from '@/providers/CursorProvider';
import { useCommandPalette } from '@/providers/CommandPaletteProvider';
import { DURATION, EASE, SPRING, STAGGER, GSAP_EASE } from '@/lib/motion/tokens';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Work',     href: '/projects' },
  { label: 'Lab',      href: '/lab' },
  { label: 'Blog',     href: '/blog' },
  { label: 'About',    href: '/about' },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { setState } = useCursorState();
  const { open: openPalette } = useCommandPalette();

  // Smart hide/show on scroll direction + glass on scroll
  useEffect(() => {
    if (!navRef.current) return;

    let lastY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        setScrolled(currentY > 80);

        // Smart hide
        if (navRef.current) {
          if (currentY > lastY && currentY > 200) {
            gsap.to(navRef.current, { y: '-100%', duration: DURATION.medium, ease: GSAP_EASE.accelerate });
          } else {
            gsap.to(navRef.current, { y: '0%', duration: DURATION.medium, ease: GSAP_EASE.decelerate });
          }
        }
        lastY = currentY;
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut: Ctrl/Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openPalette();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openPalette]);

  return (
    <>
      <motion.nav
        ref={navRef}
        className={cn(
          'fixed top-0 left-0 right-0 z-[200] transition-all duration-300',
          scrolled ? 'glass-nav' : 'bg-transparent'
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: DURATION.slow, ease: EASE.decelerate, delay: 0.2 }}
      >
        <div className="container-site flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <MagneticWrapper strength={0.3}>
            <Link
              href="/"
              className="flex items-center gap-3 group"
              onMouseEnter={() => setState('hover-link')}
              onMouseLeave={() => setState('idle')}
            >
              <div className="relative w-9 h-9 group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.8)] transition-all duration-300">
                <Image
                  src="/logo.png"
                  alt="Innovatech Solutions"
                  fill
                  sizes="36px"
                  className="object-contain"
                  priority
                />
              </div>
              <span className="hidden sm:block font-display font-bold text-sm tracking-wide text-[#F8FAFC]">
                INNOVATECH
                <span className="text-[#3B82F6]"> SOLUTIONS</span>
              </span>
            </Link>
          </MagneticWrapper>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="relative text-sm font-body font-medium text-[#94A3B8] hover:text-[#F8FAFC] transition-colors duration-200 group"
                  onMouseEnter={() => setState('hover-link')}
                  onMouseLeave={() => setState('idle')}
                >
                  {label}
                  {/* Animated underline */}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] group-hover:w-full transition-all duration-300 ease-out" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* ⌘K Button */}
            <button
              onClick={openPalette}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass text-[#64748B] hover:text-[#94A3B8] transition-colors text-xs font-mono"
              aria-label="Open command palette"
              onMouseEnter={() => setState('hover-button')}
              onMouseLeave={() => setState('idle')}
            >
              <Command size={12} />
              <span>K</span>
            </button>

            {/* CTA */}
            <MagneticWrapper strength={0.25}>
              <Link
                href="/contact"
                className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-body font-semibold transition-all duration-200 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] active:scale-95"
                onMouseEnter={() => setState('hover-button')}
                onMouseLeave={() => setState('idle')}
              >
                Start a Project
              </Link>
            </MagneticWrapper>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg glass text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Full-Screen Overlay Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[300] bg-[#06070A]/95 backdrop-blur-2xl flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.medium, ease: EASE.standard }}
          >
            {/* Close button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full glass text-[#94A3B8]"
            >
              <X size={20} />
            </button>

            {/* Links */}
            <motion.ul
              className="flex flex-col items-center gap-8"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: STAGGER.loose } },
              }}
            >
              {[...NAV_LINKS, { label: 'Contact', href: '/contact' }].map(({ label, href }) => (
                <motion.li
                  key={href}
                  variants={{
                    hidden:  { opacity: 0, y: 32, filter: 'blur(8px)' },
                    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: DURATION.slow, ease: EASE.premium } },
                  }}
                >
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="text-display-md font-display font-bold text-[#F8FAFC] hover:gradient-text transition-all duration-300"
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

            {/* Social links */}
            <motion.div
              className="absolute bottom-12 flex items-center gap-6 text-sm text-[#64748B]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: DURATION.medium }}
            >
              <span>LinkedIn</span>
              <span>·</span>
              <span>GitHub</span>
              <span>·</span>
              <span>Twitter</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
