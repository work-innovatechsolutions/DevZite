'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { VARIANTS, STAGGER, DURATION, EASE } from '@/lib/motion/tokens';
import { useCursorState } from '@/providers/CursorProvider';

const FOOTER_LINKS = {
  Services: [
    { label: 'Website Design',   href: '/services/website' },
    { label: 'Web Apps',         href: '/services/web-apps' },
    { label: 'Android Apps',     href: '/services/android-apps' },
    { label: 'AI Videos',        href: '/services/ai-videos' },
    { label: 'Blog & Content',   href: '/services/blogs' },
  ],
  Company: [
    { label: 'About Us',    href: '/about' },
    { label: 'Our Work',    href: '/projects' },
    { label: 'Our Lab',     href: '/lab' },
    { label: 'Blog',        href: '/blog' },
    { label: 'Pricing',     href: '/pricing' },
  ],
  Legal: [
    { label: 'Privacy Policy',   href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const SOCIAL_LINKS = [
  { label: 'GitHub',   href: '#' },
  { label: 'LinkedIn', href: '#' },
  { label: 'Twitter',  href: '#' },
  { label: 'Instagram',href: '#' },
];

function ScrollToTop() {
  const { setState } = useCursorState();

  const scrollTop = () => {
    window.scrollTo({ top: 0 });
  };

  return (
    <button
      onClick={scrollTop}
      onMouseEnter={() => setState('hover-button')}
      onMouseLeave={() => setState('idle')}
      className="group flex items-center justify-center w-10 h-10 rounded-full glass hover:border-[rgba(59,130,246,0.4)] transition-all duration-300 hover:glow-blue"
      aria-label="Scroll to top"
    >
      <ArrowUp size={16} className="text-[#94A3B8] group-hover:text-[#3B82F6] transition-colors" />
    </button>
  );
}

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { setState } = useCursorState();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="relative border-gradient-top">
      {/* Soft bloom at top of footer */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px"
        style={{ boxShadow: '0 0 80px 1px rgba(59,130,246,0.2)' }}
        aria-hidden="true"
      />

      <div className="container-site section-padding-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand column */}
          <motion.div
            className="lg:col-span-4"
            variants={VARIANTS.blurUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
          >
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="relative w-8 h-8">
                <Image src="/logo.png" alt="Innovatech Solutions" fill sizes="32px" className="object-contain" />
              </div>
              <span className="font-display font-bold text-sm tracking-wide">
                INNOVATECH <span className="text-[#3B82F6]">SOLUTIONS</span>
              </span>
            </Link>

            <p className="text-[#64748B] text-sm leading-relaxed mb-6 max-w-xs">
              We build digital experiences that move people — technically flawless,
              visually memorable, and built to last.
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-body font-semibold text-[#94A3B8] uppercase tracking-widest mb-3">
                Stay in the loop
              </p>
              {subscribed ? (
                <motion.p
                  className="text-sm text-[#3B82F6] font-medium"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ✓ You&apos;re subscribed!
                </motion.p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 px-3 py-2 rounded-lg glass text-sm text-[#F8FAFC] placeholder-[#475569] outline-none focus:border-[rgba(59,130,246,0.5)] transition-colors"
                    required
                    aria-label="Email address"
                  />
                  <button
                    type="submit"
                    onMouseEnter={() => setState('hover-button')}
                    onMouseLeave={() => setState('idle')}
                    className="px-3 py-2 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-semibold transition-all duration-200 active:scale-95"
                  >
                    →
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links], colIdx) => (
            <motion.div
              key={section}
              className="lg:col-span-2"
              variants={VARIANTS.blurUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-10%' }}
              transition={{ delay: colIdx * STAGGER.normal }}
            >
              <p className="text-xs font-body font-semibold text-[#94A3B8] uppercase tracking-widest mb-4">
                {section}
              </p>
              <ul className="flex flex-col gap-3">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-[#64748B] hover:text-[#94A3B8] transition-colors duration-200"
                      onMouseEnter={() => setState('hover-link')}
                      onMouseLeave={() => setState('idle')}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#475569] font-body">
            © {new Date().getFullYear()}{' '}
            <span className="gradient-text font-semibold">Innovatech Solutions</span>
            . All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {SOCIAL_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs text-[#475569] hover:text-[#94A3B8] transition-colors duration-200"
                onMouseEnter={() => setState('hover-link')}
                onMouseLeave={() => setState('idle')}
              >
                {label}
              </Link>
            ))}
            <ScrollToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
